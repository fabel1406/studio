// src/ai/flows/residue-details.ts
'use server';

/**
 * @fileOverview A Genkit flow for generating enhanced descriptions of residues.
 *
 * - generateResidueDetails - A function that generates enhanced descriptions of residues, including potential uses and environmental benefits.
 * - GenerateResidueDetailsInput - The input type for the generateResidueDetails function.
 * - GenerateResidueDetailsOutput - The return type for the generateResidueDetails function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateResidueDetailsInputSchema = z.object({
  residueType: z.string().describe('The type of residue.'),
  residueCategory: z.string().describe('The category of the residue (e.g., BIOMASS, FOOD, AGRO, OTHERS).'),
  residueDescription: z.string().describe('A description of the residue.'),
});
export type GenerateResidueDetailsInput = z.infer<typeof GenerateResidueDetailsInputSchema>;

const GenerateResidueDetailsOutputSchema = z.object({
  enhancedDescription: z.string().describe('An enhanced description of the residue, including potential uses and environmental benefits.'),
});
export type GenerateResidueDetailsOutput = z.infer<typeof GenerateResidueDetailsOutputSchema>;

export async function generateResidueDetails(input: GenerateResidueDetailsInput): Promise<GenerateResidueDetailsOutput> {
  return generateResidueDetailsFlow(input);
}

const residueDetailsPrompt = ai.definePrompt({
  name: 'residueDetailsPrompt',
  input: { schema: GenerateResidueDetailsInputSchema },
  output: { schema: GenerateResidueDetailsOutputSchema },
  prompt: `You are an expert in waste valorization and environmental sustainability. Generate an enhanced description of the following residue, including potential uses and environmental benefits.

Residue Type: {{{residueType}}}
Residue Category: {{{residueCategory}}}
Residue Description: {{{residueDescription}}}

Enhanced Description:`,
});

const generateResidueDetailsFlow = ai.defineFlow(
  {
    name: 'generateResidueDetailsFlow',
    inputSchema: GenerateResidueDetailsInputSchema,
    outputSchema: GenerateResidueDetailsOutputSchema,
  },
  async input => {
    const { output } = await residueDetailsPrompt(input);
    return output!;
  }
);
