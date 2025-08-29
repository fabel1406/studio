// src/app/dashboard/marketplace/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { mockResidues, mockNeeds } from "@/lib/data";
import { ResidueCard } from "@/components/residue-card";
import { NeedCard } from "@/components/need-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, PlusCircle, Sparkles, Loader2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link";
import { useRole } from '../layout';
import type { Residue, Need } from '@/lib/types';
import { getMatchSuggestions } from '@/ai/flows/match-suggestions';
import { getAllNeeds } from '@/services/need-service';
import { getAllResidues } from '@/services/residue-service';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/hooks/use-toast';

const uniqueResidueTypes = [...new Set(mockResidues.map(r => r.type))];
const uniqueNeedTypes = [...new Set(mockNeeds.map(r => r.residueType))];
const allUniqueTypes = [...new Set([...uniqueResidueTypes, ...uniqueNeedTypes])];

const MAX_QUANTITY = Math.max(...mockResidues.map(r => r.quantity), 1000);
const MAX_PRICE = Math.max(...mockResidues.map(r => r.pricePerUnit || 0), 50);

export default function MarketplacePage() {
  const { role, currentUserId } = useRole();
  const { toast } = useToast();
  
  // Basic Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL_CATEGORIES');
  const [countryFilter, setCountryFilter] = useState('ALL_COUNTRIES');

  // Advanced Filters State
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [quantityRange, setQuantityRange] = useState([0, MAX_QUANTITY]);
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);

  const [aiSuggestions, setAiSuggestions] = useState<Residue[] | Need[]>([]);
  const [suggestionType, setSuggestionType] = useState<'residue' | 'need' | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);

  const activeAdvancedFilters = 
    nameFilter !== '' || 
    quantityRange[0] !== 0 || quantityRange[1] !== MAX_QUANTITY ||
    priceRange[0] !== 0 || priceRange[1] !== MAX_PRICE;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!currentUserId) return;
      setIsLoadingSuggestions(true);

      try {
        if (role === 'GENERATOR' || role === 'BOTH') {
            const userResidues = getAllResidues().filter(r => r.companyId === currentUserId && r.status === 'ACTIVE');
            if (userResidues.length > 0) {
                const sourceResidue = userResidues[0];
                const allNeeds = getAllNeeds();
                const result = await getMatchSuggestions({
                    matchType: 'findTransformers',
                    sourceResidue: sourceResidue,
                    availableNeeds: allNeeds,
                });
                const suggestedNeeds = result.suggestions.map(s => allNeeds.find(n => n.id === s.matchedId)).filter(Boolean) as Need[];
                setAiSuggestions(suggestedNeeds);
                setSuggestionType('need');
            } else {
              setAiSuggestions([]);
            }
        }
        
        if (role === 'TRANSFORMER') {
            const userNeeds = getAllNeeds().filter(n => n.companyId === currentUserId && n.status === 'ACTIVE');
            if (userNeeds.length > 0) {
                const sourceNeed = userNeeds[0];
                const allResidues = getAllResidues();
                 const result = await getMatchSuggestions({
                    matchType: 'findGenerators',
                    sourceNeed: sourceNeed,
                    availableResidues: allResidues,
                });
                 const suggestedResidues = result.suggestions.map(s => allResidues.find(r => r.id === s.matchedId)).filter(Boolean) as Residue[];
                setAiSuggestions(suggestedResidues);
                setSuggestionType('residue');
            }
        }
      } catch (error) {
        console.error("Failed to fetch AI suggestions:", error);
        toast({
            title: "Error de Sugerencias",
            description: "No se pudieron cargar las recomendaciones de la IA.",
            variant: "destructive"
        });
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [role, currentUserId, toast]);


  const filteredResidues = mockResidues.filter(residue => {
    const companyCountry = residue.company?.country.toLowerCase();
    const typeMatch = nameFilter ? residue.type.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const categoryMatch = categoryFilter === 'ALL_CATEGORIES' || residue.category === categoryFilter;
    const countryMatch = countryFilter === 'ALL_COUNTRIES' || (companyCountry && companyCountry.includes(countryFilter));
    const quantityMatch = residue.quantity >= quantityRange[0] && residue.quantity <= quantityRange[1];
    const priceMatch = (residue.pricePerUnit || 0) >= priceRange[0] && (residue.pricePerUnit || 0) <= priceRange[1];

    return typeMatch && categoryMatch && countryMatch && quantityMatch && priceMatch;
  });

  const filteredNeeds = mockNeeds.filter(need => {
    const typeMatch = nameFilter ? need.residueType.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const categoryMatch = categoryFilter === 'ALL_CATEGORIES' || need.category === categoryFilter;
    const quantityMatch = need.quantity >= quantityRange[0] && need.quantity <= quantityRange[1];
    
    // Needs don't have country/price filters for now
    return typeMatch && categoryMatch && quantityMatch;
  });

  const resetAdvancedFilters = () => {
    setNameFilter('');
    setQuantityRange([0, MAX_QUANTITY]);
    setPriceRange([0, MAX_PRICE]);
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
            <p className="text-muted-foreground">Descubre residuos o encuentra recursos valiosos.</p>
        </div>
        <div className="flex w-full md:w-auto items-center space-x-2">
            {(role === "GENERATOR" || role === "BOTH") && (
              <Button asChild className="flex-1 md:flex-none">
                  <Link href="/dashboard/residues/create">
                      <PlusCircle className="mr-2 h-4 w-4" /> Añadir Residuo
                  </Link>
              </Button>
            )}
            {(role === "TRANSFORMER" || role === "BOTH") && (
               <Button asChild variant="outline" className="flex-1 md:flex-none">
                  <Link href="/dashboard/needs/create">
                      <PlusCircle className="mr-2 h-4 w-4" /> Publicar Necesidad
                  </Link>
              </Button>
            )}
        </div>
      </div>
      
      {isLoadingSuggestions ? (
        <Card className="p-6 flex items-center justify-center min-h-[200px]">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Buscando recomendaciones para ti...</p>
        </Card>
      ) : aiSuggestions.length > 0 && (
          <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Sparkles className="text-primary" />
                      Recomendado para ti
                  </CardTitle>
                  <CardDescription>
                      {suggestionType === 'need'
                          ? "Estas son las necesidades que mejor encajan con los residuos que ofreces."
                          : "Estos son los residuos disponibles que mejor encajan con lo que buscas."
                      }
                  </CardDescription>
              </CardHeader>
              <Carousel
                  opts={{ align: "start", loop: false }}
                  className="w-full px-12"
              >
                  <CarouselContent className="-ml-4">
                      {aiSuggestions.map((item) => (
                          <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                              <div className="p-1">
                                  {suggestionType === 'residue'
                                      ? <ResidueCard residue={item as Residue} />
                                      : <NeedCard need={item as Need} />
                                  }
                              </div>
                          </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
              </Carousel>
          </Card>
      )}


      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            <Select onValueChange={setCategoryFilter} defaultValue="ALL_CATEGORIES">
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL_CATEGORIES">Todas las categorías</SelectItem>
                    <SelectItem value="AGRO">Agroindustrial</SelectItem>
                    <SelectItem value="FOOD">Residuos alimentarios</SelectItem>
                    <SelectItem value="BIOMASS">Biomasa</SelectItem>
                    <SelectItem value="OTHERS">Otros</SelectItem>
                </SelectContent>
            </Select>
            <Select onValueChange={setCountryFilter} defaultValue="ALL_COUNTRIES">
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por país" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL_COUNTRIES">Todos los países</SelectItem>
                    <SelectItem value="españa">España</SelectItem>
                    <SelectItem value="portugal">Portugal</SelectItem>
                    <SelectItem value="francia">Francia</SelectItem>
                </SelectContent>
            </Select>
             <Dialog open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="relative">
                        <ListFilter className="mr-2 h-4 w-4" /> Filtros avanzados
                        {activeAdvancedFilters && <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Filtros Avanzados</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div>
                          <Label htmlFor="name_filter">Nombre del residuo</Label>
                          <Input id="name_filter" value={nameFilter} onChange={e => setNameFilter(e.target.value)} placeholder="Ej: Alperujo, Serrín..." />
                        </div>
                        
                        <div>
                           <Label>Rango de Cantidad (TON)</Label>
                           <p className="text-sm text-center text-muted-foreground">{quantityRange[0]} - {quantityRange[1]}</p>
                           <Slider
                                defaultValue={[0, MAX_QUANTITY]}
                                value={quantityRange}
                                onValueChange={setQuantityRange}
                                max={MAX_QUANTITY}
                                step={1}
                            />
                        </div>

                        <div>
                           <Label>Rango de Precio ($ / TON)</Label>
                           <p className="text-sm text-center text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</p>
                           <Slider
                                defaultValue={[0, MAX_PRICE]}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={MAX_PRICE}
                                step={1}
                            />
                        </div>
                    </div>
                     <DialogFooter>
                      {activeAdvancedFilters && (
                        <Button variant="ghost" onClick={resetAdvancedFilters} className="mr-auto">
                          <X className="mr-2 h-4 w-4" /> Limpiar filtros
                        </Button>
                      )}
                      <DialogClose asChild>
                          <Button>Aplicar</Button>
                      </DialogClose>
                  </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </div>

      <Tabs defaultValue="residues" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="residues">Residuos Disponibles ({filteredResidues.length})</TabsTrigger>
          <TabsTrigger value="needs">Necesidades del Mercado ({filteredNeeds.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="residues">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {filteredResidues.length > 0 ? (
              filteredResidues.map((residue) => (
                <ResidueCard key={residue.id} residue={residue} />
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-muted-foreground">
                <h3 className="text-xl font-semibold">No se encontraron residuos</h3>
                <p>Prueba a cambiar los filtros o a ampliar tu búsqueda.</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="needs">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
            {filteredNeeds.length > 0 ? (
              filteredNeeds.map((need) => (
                <NeedCard key={need.id} need={need} />
              ))
            ) : (
               <div className="col-span-full text-center py-16 text-muted-foreground">
                <h3 className="text-xl font-semibold">No se encontraron necesidades</h3>
                <p>Actualmente no hay necesidades publicadas que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
