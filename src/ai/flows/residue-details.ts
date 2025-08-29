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
  enhancedDescription: z.string().describe('An enhanced, professional, and attractive description of the residue, including potential uses and environmental benefits. Must be in Spanish.'),
});
export type GenerateResidueDetailsOutput = z.infer<typeof GenerateResidueDetailsOutputSchema>;

export async function generateResidueDetails(input: GenerateResidueDetailsInput): Promise<GenerateResidueDetailsOutput> {
  return generateResidueDetailsFlow(input);
}

const residueDetailsPrompt = ai.definePrompt({
  name: 'residueDetailsPrompt',
  input: { schema: GenerateResidueDetailsInputSchema },
  output: { schema: GenerateResidueDetailsOutputSchema },
  prompt: `
    Eres un experto en valorización de residuos y sostenibilidad medioambiental.
    Tu tarea es generar una descripción mejorada, profesional y atractiva del siguiente residuo.
    La descripción debe estar en español y debe incluir:
    1.  Una breve introducción sobre el residuo.
    2.  Una lista de posibles usos o aplicaciones (ej. "Producción de biogás", "Compostaje de alta calidad", "Alimentación animal", etc.).
    3.  Un breve resumen de los beneficios medioambientales de su reutilización.
    
    Adopta un tono comercial y convincente para hacer el residuo más atractivo a potenciales compradores en un marketplace B2B.

    DATOS DEL RESIDUO:
    - Tipo: {{{residueType}}}
    - Categoría: {{{residueCategory}}}
    - Descripción actual: {{{residueDescription}}}

    DESCRIPCIÓN MEJORADA (en español):
  `,
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
