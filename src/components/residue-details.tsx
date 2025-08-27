"use client";

import { useState } from 'react';
import type { Residue, Match } from '@/lib/types';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { generateResidueDetails } from '@/ai/flows/residue-details';
import { getMatchSuggestions } from '@/ai/flows/match-suggestions';
import { Sparkles, Recycle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


export function ResidueDetails({ residue }: { residue: Residue }) {
    const { toast } = useToast();
    const [enhancedDescription, setEnhancedDescription] = useState<string>('');
    const [matches, setMatches] = useState<Match[]>([]);
    const [isDescriptionLoading, setIsDescriptionLoading] = useState(false);
    const [isMatchesLoading, setIsMatchesLoading] = useState(false);

    const handleGenerateDescription = async () => {
        setIsDescriptionLoading(true);
        try {
            const result = await generateResidueDetails({
                residueType: residue.type,
                residueCategory: residue.category,
                residueDescription: residue.description || '',
            });
            setEnhancedDescription(result.enhancedDescription);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to generate enhanced description.",
                variant: "destructive",
            });
        } finally {
            setIsDescriptionLoading(false);
        }
    };

    const handleFindMatches = async () => {
        setIsMatchesLoading(true);
        try {
            const result = await getMatchSuggestions({
                transformerCompanyId: 'user-company-id', // This would be the current user's company ID
                residueType: residue.type,
                locationLat: residue.locationLat || 0,
                locationLng: residue.locationLng || 0,
                quantityNeeded: 10, // Mock quantity
            });
            // In a real app, we would use the IDs to fetch company details.
            // Here we'll just mock some data with the result.
            const mockMatches = result.suggestions.map(s => ({
                residueId: s.residueId,
                score: s.score,
                reason: s.reason,
            }));
            setMatches(mockMatches);
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to find matches.",
                variant: "destructive",
            });
        } finally {
            setIsMatchesLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Analysis & Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                <span>AI Enhanced Description</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2">
                            <p className="text-muted-foreground mb-4">{residue.description}</p>
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
                                    <Sparkles className="mr-2 h-4 w-4" /> Generate Analysis
                                </Button>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                         <AccordionTrigger className="text-lg">
                             <div className="flex items-center gap-2">
                                <Recycle className="h-5 w-5 text-primary" />
                                <span>Potential Matches</span>
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
                                                <h4 className="font-semibold">Transformer Company #{index + 1}</h4>
                                                <Badge>Score: {(match.score * 100).toFixed(0)}%</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-2">{match.reason}</p>
                                             <Button size="sm" className="mt-4">Contact Transformer</Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <Button onClick={handleFindMatches}>
                                     <Recycle className="mr-2 h-4 w-4" /> Find Matches
                                </Button>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
