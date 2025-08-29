// src/components/analysis-panel.tsx
"use client";

import { useState } from 'react';
import type { Residue, Match, Need } from '@/lib/types';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { generateResidueDetails } from '@/ai/flows/residue-details';
import { generateNeedDetails } from '@/ai/flows/need-details';
import { getMatchSuggestions } from '@/ai/flows/match-suggestions';
import { Sparkles, Recycle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllNeeds } from '@/services/need-service';
import { getAllResidues } from '@/services/residue-service';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type AnalysisPanelProps = 
    | { type: 'residue'; item: Residue }
    | { type: 'need'; item: Need };

export function AnalysisPanel({ item, type }: AnalysisPanelProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [enhancedDescription, setEnhancedDescription] = useState<string>('');
    const [matches, setMatches] = useState<Match[]>([]);
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
    const [isMatchesLoading, setIsMatchesLoading] = useState(false);

    const handleGenerateDescription = async () => {
        setIsDescriptionLoading(true);
        try {
            if (type === 'residue') {
                const result = await generateResidueDetails({
                    residueType: item.type,
                    residueCategory: item.category,
                    residueDescription: item.description || '',
                });
                setEnhancedDescription(result.enhancedDescription);
            } else { // type === 'need'
                const result = await generateNeedDetails({
                    residueType: item.residueType,
                    residueCategory: item.category,
                    needSpecifications: item.specifications || '',
                });
                setEnhancedDescription(result.enhancedDescription);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudo generar el análisis.",
                variant: "destructive",
            });
        } finally {
            setIsDescriptionLoading(false);
        }
    };

    const handleFindMatches = async () => {
        setIsMatchesLoading(true);
        try {
            let result;
            if (type === 'residue') {
                const allNeeds: Need[] = await getAllNeeds();
                result = await getMatchSuggestions({
                    matchType: 'findTransformers',
                    sourceResidue: item,
                    availableNeeds: allNeeds,
                });
            } else { // type === 'need'
                const allResidues: Residue[] = await getAllResidues();
                result = await getMatchSuggestions({
                    matchType: 'findGenerators',
                    sourceNeed: item,
                    availableResidues: allResidues,
                });
            }
            
            if (result && result.suggestions) {
                 setMatches(result.suggestions);
            } else {
                 setMatches([]);
            }
           
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudieron encontrar coincidencias.",
                variant: "destructive",
            });
        } finally {
            setIsMatchesLoading(false);
        }
    };

    const getMatchedItemPath = (match: Match) => {
        return type === 'residue' 
            ? `/dashboard/needs/${match.matchedId}`
            : `/dashboard/residues/${match.matchedId}`;
    }

    const descriptionTitle = type === 'residue' ? "Descripción Mejorada con IA" : "Análisis Estratégico con IA";
    const descriptionText = type === 'residue' 
        ? (item as Residue).description 
        : `Buscando ${(item as Need).residueType} para la categoría de ${(item as Need).category}`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Análisis y Oportunidades</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <span>{descriptionTitle}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            <p className="text-muted-foreground mb-4">{descriptionText}</p>
                            {isDescriptionLoading ? (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ) : enhancedDescription ? (
                                <p className="text-foreground whitespace-pre-wrap">{enhancedDescription}</p>
                            ) : (
                                <Button onClick={handleGenerateDescription}>
                                    <Sparkles className="mr-2 h-4 w-4" /> Generar Análisis
                                </Button>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                         <AccordionTrigger className="text-lg">
                             <div className="flex items-center gap-2">
                                <Recycle className="h-5 w-5 text-primary" />
                                <span>Coincidencias Potenciales</span>
                             </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            {isMatchesLoading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : matches.length > 0 ? (
                                <div className="space-y-4">
                                    {matches.map((match, index) => (
                                        <div key={index} className="p-4 border rounded-lg bg-background/50">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold">{match.company?.name || `Empresa #${index + 1}`}</h4>
                                                <Badge>Puntuación: {(match.score * 100).toFixed(0)}%</Badge>
                                            </div>
                                             <p className="text-sm text-muted-foreground mt-1 mb-2">{match.company?.city}, {match.company?.country}</p>
                                            <p className="text-sm text-muted-foreground mt-2">{match.reason}</p>
                                             <Button size="sm" className="mt-4" asChild>
                                                <Link href={getMatchedItemPath(match)}>
                                                     <Send className="mr-2 h-4 w-4" />
                                                     Ver y Contactar
                                                </Link>
                                             </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Button onClick={handleFindMatches}>
                                     <Recycle className="mr-2 h-4 w-4" /> Encontrar Coincidencias
                                </Button>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
