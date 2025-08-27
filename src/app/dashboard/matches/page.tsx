// src/app/dashboard/matches/page.tsx
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { mockResidues } from '@/lib/data';
import type { Residue, Match } from '@/lib/types';
import { getMatchSuggestions } from '@/ai/flows/match-suggestions';
import { Loader2, Recycle, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Mocking the current user's company
const currentUserCompanyId = 'comp-1'; 
const userResidues = mockResidues.filter(r => r.companyId === currentUserCompanyId);

type MatchResult = {
    residueId: string;
    matches: Match[];
}

export default function MatchesPage() {
    const { toast } = useToast();
    const [loadingResidueId, setLoadingResidueId] = useState<string | null>(null);
    const [matchResults, setMatchResults] = useState<MatchResult[]>([]);

    const handleFindMatches = async (residue: Residue) => {
        setLoadingResidueId(residue.id);
        try {
            const result = await getMatchSuggestions({
                transformerCompanyId: currentUserCompanyId,
                residueType: residue.type,
                locationLat: residue.locationLat || 0,
                locationLng: residue.locationLng || 0,
                quantityNeeded: 10, // Mock quantity needed for suggestions
            });
            
            const newMatchResult: MatchResult = {
                residueId: residue.id,
                // In a real app, we would use the IDs to fetch company details.
                // Here we'll just mock some data with the result.
                matches: result.suggestions.map(s => ({
                    residueId: s.residueId,
                    score: s.score,
                    reason: s.reason,
                })),
            };

            setMatchResults(prevResults => {
                const otherResults = prevResults.filter(r => r.residueId !== residue.id);
                return [...otherResults, newMatchResult];
            });

        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudieron encontrar coincidencias.",
                variant: "destructive",
            });
        } finally {
            setLoadingResidueId(null);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Coincidencias Inteligentes</h2>
                    <p className="text-muted-foreground">
                        Encuentra los socios ideales para valorizar tus residuos.
                    </p>
                </div>
            </div>

            <div className="grid gap-8">
                {userResidues.map(residue => {
                    const foundMatches = matchResults.find(r => r.residueId === residue.id)?.matches;
                    return (
                        <Card key={residue.id} className="shadow-md">
                            <CardHeader>
                                <div className="flex flex-col md:flex-row justify-between md:items-center">
                                    <div>
                                        <CardTitle>Oportunidades para: {residue.type}</CardTitle>
                                        <CardDescription>{residue.quantity} {residue.unit} disponibles</CardDescription>
                                    </div>
                                    <Button 
                                        onClick={() => handleFindMatches(residue)} 
                                        disabled={loadingResidueId === residue.id}
                                        className="mt-4 md:mt-0"
                                    >
                                        {loadingResidueId === residue.id ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Recycle className="mr-2 h-4 w-4" />
                                        )}
                                        {foundMatches ? 'Actualizar Coincidencias' : 'Encontrar Coincidencias'}
                                    </Button>
                                </div>
                            </CardHeader>
                            {foundMatches && (
                                <CardContent>
                                    <Separator className="my-4" />
                                    {foundMatches.length > 0 ? (
                                        <div className="grid gap-6">
                                            {foundMatches.map((match, index) => (
                                                <div key={index} className="p-4 border rounded-lg bg-background/50">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <h4 className="font-semibold">Empresa Transformadora Potencial #{index + 1}</h4>
                                                        <Badge variant="secondary">Puntuación: {(match.score * 100).toFixed(0)}%</Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-2 mb-4">{match.reason}</p>
                                                    <Button size="sm">
                                                        <Send className="mr-2 h-4 w-4" />
                                                        Contactar
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-muted-foreground py-8">
                                            No se han encontrado nuevas coincidencias por el momento.
                                        </p>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
                 {userResidues.length === 0 && (
                    <Card className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-muted-foreground">No tienes residuos publicados.</p>
                            <Button variant="link" asChild>
                                <a href="/dashboard/residues">Publica un residuo para encontrar coincidencias.</a>
                            </Button>
                        </div>
                    </Card>
                 )}
            </div>
        </div>
    );
}
