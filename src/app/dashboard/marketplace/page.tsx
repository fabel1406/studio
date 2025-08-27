// src/app/dashboard/marketplace/page.tsx
"use client";

import { useState } from 'react';
import { mockResidues, mockNeeds } from "@/lib/data";
import { ResidueCard } from "@/components/residue-card";
import { NeedCard } from "@/components/need-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilter, PlusCircle } from "lucide-react";
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

const uniqueResidueTypes = [...new Set(mockResidues.map(r => r.type))];
const uniqueNeedTypes = [...new Set(mockNeeds.map(r => r.residueType))];
const allUniqueTypes = [...new Set([...uniqueResidueTypes, ...uniqueNeedTypes])];

export default function MarketplacePage() {
  const { role } = useRole();
  const [typeFilter, setTypeFilter] = useState('ALL_TYPES');
  const [categoryFilter, setCategoryFilter] = useState('ALL_CATEGORIES');
  const [countryFilter, setCountryFilter] = useState('ALL_COUNTRIES');

  const filteredResidues = mockResidues.filter(residue => {
    const companyCountry = residue.company?.country.toLowerCase();
    return (
      (typeFilter === 'ALL_TYPES' || residue.type === typeFilter) &&
      (categoryFilter === 'ALL_CATEGORIES' || residue.category === categoryFilter) &&
      (countryFilter === 'ALL_COUNTRIES' || (companyCountry && companyCountry.includes(countryFilter)))
    );
  });

  const filteredNeeds = mockNeeds.filter(need => {
    // Assuming needs will also be associated with a company location in the future
    return (
      (typeFilter === 'ALL_TYPES' || need.residueType === typeFilter) &&
      (categoryFilter === 'ALL_CATEGORIES' || need.category === categoryFilter)
    );
  });

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
      
      <div className="bg-card p-4 rounded-lg border shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select onValueChange={setTypeFilter} defaultValue="ALL_TYPES">
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL_TYPES">Todos los tipos</SelectItem>
                    {allUniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
             <Button variant="outline">
                <ListFilter className="mr-2 h-4 w-4" /> Filtros avanzados
            </Button>
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
