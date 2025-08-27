// src/app/dashboard/matches/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { Residue, Need, Match, Company } from '@/lib/types';
import { getMatchSuggestions } from '@/ai/flows/match-suggestions';
import { Loader2, Recycle, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRole } from '../layout';
import { getAllResidues, getResidueById } from '@/services/residue-service';
import { getAllNeeds } from '@/services/need-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

type MatchResult = {
    sourceId: string; // Can be a residueId or a needId
    matches: Match[];
}

export default function MatchesPage() {
    const { toast } = useToast();
    const { role, currentUserId } = useRole();
    const [loadingSourceId, setLoadingSourceId] = useState<string | null>(null);
    const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
    
    const [userResidues, setUserResidues] = useState<Residue[]>([]);
    const [userNeeds, setUserNeeds] = useState<Need[]>([]);
    const [allResidues, setAllResidues] = useState<Residue[]>([]);
    const [allNeeds, setAllNeeds] = useState<Need[]>([]);

    useEffect(() => {
        if(currentUserId) {
            setUserResidues(getAllResidues().filter(r => r.companyId === currentUserId));
            setUserNeeds(getAllNeeds().filter(n => n.companyId === currentUserId));
            setAllResidues(getAllResidues());
            setAllNeeds(getAllNeeds());
        }
    }, [currentUserId]);

    const handleFindGeneratorMatches = async (need: Need) => {
        setLoadingSourceId(need.id);
        try {
            const needCompany = need.company;
            if (!needCompany) throw new Error("La empresa de la necesidad no fue encontrada.");
            
            const result = await getMatchSuggestions({
                matchType: 'findGenerators',
                sourceNeed: need,
                availableResidues: allResidues,
            });
            
            const newMatchResult: MatchResult = {
                sourceId: need.id,
                matches: result.suggestions,
            };

            setMatchResults(prevResults => {
                const otherResults = prevResults.filter(r => r.sourceId !== need.id);
                return [...otherResults, newMatchResult];
            });

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudieron encontrar coincidencias para tu necesidad.",
                variant: "destructive",
            });
        } finally {
            setLoadingSourceId(null);
        }
    };
    
    const handleFindTransformerMatches = async (residue: Residue) => {
        setLoadingSourceId(residue.id);
        try {
            const result = await getMatchSuggestions({
                matchType: 'findTransformers',
                sourceResidue: residue,
                availableNeeds: allNeeds,
            });
            
            const newMatchResult: MatchResult = {
                sourceId: residue.id,
                matches: result.suggestions,
            };

            setMatchResults(prevResults => {
                const otherResults = prevResults.filter(r => r.sourceId !== residue.id);
                return [...otherResults, newMatchResult];
            });

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudieron encontrar coincidencias para tu residuo.",
                variant: "destructive",
            });
        } finally {
            setLoadingSourceId(null);
        }
    };
    
    const renderMatchList = (sourceId: string) => {
        const foundMatches = matchResults.find(r => r.sourceId === sourceId)?.matches;
        if (!foundMatches) return null;

        return (
             <CardContent>
                <Separator className="my-4" />
                {foundMatches.length > 0 ? (
                    <div className="grid gap-6">
                        {foundMatches.map((match, index) => {
                            const matchedCompany = match.company;
                            return (
                            <div key={index} className="p-4 border rounded-lg bg-background/50">
                                <div className="flex justify-between items-start gap-4">
                                    <h4 className="font-semibold">{matchedCompany?.name || `Socio Potencial #${index + 1}`}</h4>
                                    <Badge variant="secondary">Puntuación: {(match.score * 100).toFixed(0)}%</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 mb-3">{matchedCompany?.city}, {matchedCompany?.country}</p>
                                <p className="text-sm text-muted-foreground mb-4">{match.reason}</p>
                                <Button asChild size="sm">
                                  <Link href={`/dashboard/residues/${match.matchedId}`}>
                                    <Send className="mr-2 h-4 w-4" />
                                    Contactar
                                  </Link>
                                </Button>
                            </div>
                        )})}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">
                        No se han encontrado nuevas coincidencias por el momento.
                    </p>
                )}
            </CardContent>
        )
    };
    
    const renderGeneratorView = () => (
        <div className="grid gap-8">
            {userResidues.length > 0 ? userResidues.map(residue => (
                <Card key={residue.id} className="shadow-md">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                                <CardTitle>Oportunidades para: {residue.type}</CardTitle>
                                <CardDescription>{residue.quantity} {residue.unit} disponibles</CardDescription>
                            </div>
                            <Button 
                                onClick={() => handleFindTransformerMatches(residue)} 
                                disabled={loadingSourceId === residue.id}
                                className="mt-4 md:mt-0"
                            >
                                {loadingSourceId === residue.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Recycle className="mr-2 h-4 w-4" />
                                )}
                                {matchResults.some(r => r.sourceId === residue.id) ? 'Actualizar Coincidencias' : 'Encontrar Transformadores'}
                            </Button>
                        </div>
                    </CardHeader>
                    {renderMatchList(residue.id)}
                </Card>
            )) : (
                 <Card className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-muted-foreground">No tienes residuos publicados.</p>
                        <Button variant="link" asChild>
                            <Link href="/dashboard/residues/create">Publica un residuo para encontrar coincidencias.</Link>
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );
    
    const renderTransformerView = () => (
         <div className="grid gap-8">
            {userNeeds.length > 0 ? userNeeds.map(need => (
                <Card key={need.id} className="shadow-md">
                    <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                            <div>
                                <CardTitle>Buscando proveedores para: {need.residueType}</CardTitle>
                                <CardDescription>{need.quantity} {need.unit} / {need.frequency}</CardDescription>
                            </div>
                            <Button 
                                onClick={() => handleFindGeneratorMatches(need)} 
                                disabled={loadingSourceId === need.id}
                                className="mt-4 md:mt-0"
                            >
                                {loadingSourceId === need.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Recycle className="mr-2 h-4 w-4" />
                                )}
                                {matchResults.some(r => r.sourceId === need.id) ? 'Actualizar Coincidencias' : 'Encontrar Generadores'}
                            </Button>
                        </div>
                    </CardHeader>
                    {renderMatchList(need.id)}
                </Card>
            )) : (
                 <Card className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <p className="text-muted-foreground">No tienes necesidades publicadas.</p>
                        <Button variant="link" asChild>
                            <Link href="/dashboard/needs/create">Publica una necesidad para encontrar coincidencias.</Link>
                        </Button>
                    </div>
                </Card>
            )}
        </div>
    );


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Coincidencias Inteligentes</h2>
                    <p className="text-muted-foreground">
                        Encuentra los socios ideales para valorizar tus residuos o cubrir tus necesidades.
                    </p>
                </div>
            </div>
            
            {role === 'BOTH' ? (
                <Tabs defaultValue="generator" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                      <TabsTrigger value="generator">Soy Generador</TabsTrigger>
                      <TabsTrigger value="transformer">Soy Transformador</TabsTrigger>
                    </TabsList>
                    <TabsContent value="generator" className="mt-6">
                        {renderGeneratorView()}
                    </TabsContent>
                    <TabsContent value="transformer" className="mt-6">
                        {renderTransformerView()}
                    </TabsContent>
                </Tabs>
            ) : role === 'GENERATOR' ? (
                renderGeneratorView()
            ) : (
                renderTransformerView()
            )}
        </div>
    );
}
