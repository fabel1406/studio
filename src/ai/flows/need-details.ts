// src/ai/flows/need-details.ts
'use server';

/**
 * @fileOverview A Genkit flow for generating enhanced analysis of needs.
 *
 * - generateNeedDetails - A function that generates enhanced descriptions of needs, including potential acquisition strategies.
 * - GenerateNeedDetailsInput - The input type for the generateNeedDetails function.
 * - GenerateNeedDetailsOutput - The return type for the generateNeedDetails function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateNeedDetailsInputSchema = z.object({
  residueType: z.string().describe('The type of residue being sought.'),
  residueCategory: z.string().describe('The category of the residue (e.g., BIOMASS, FOOD, AGRO, OTHERS).'),
  needSpecifications: z.string().describe('Any specific requirements for the need.'),
});
export type GenerateNeedDetailsInput = z.infer<typeof GenerateNeedDetailsInputSchema>;

const GenerateNeedDetailsOutputSchema = z.object({
  enhancedDescription: z.string().describe('An enhanced, professional, and attractive description of the need, including sourcing strategies and potential benefits for suppliers. Must be in Spanish.'),
});
export type GenerateNeedDetailsOutput = z.infer<typeof GenerateNeedDetailsOutputSchema>;

export async function generateNeedDetails(input: GenerateNeedDetailsInput): Promise<GenerateNeedDetailsOutput> {
  return generateNeedDetailsFlow(input);
}

const needDetailsPrompt = ai.definePrompt({
  name: 'needDetailsPrompt',
  input: { schema: GenerateNeedDetailsInputSchema },
  output: { schema: GenerateNeedDetailsOutputSchema },
  prompt: `
    Eres un experto en cadenas de suministro y economía circular.
    Tu tarea es generar un análisis mejorado, profesional y atractivo para la siguiente necesidad de materia prima.
    El análisis debe estar en español y debe incluir:
    1.  Una breve introducción sobre la importancia del residuo buscado.
    2.  Una lista de posibles tipos de proveedores o industrias que podrían generar este residuo.
    3.  Un breve resumen de los beneficios para los proveedores que decidan colaborar.
    
    Adopta un tono estratégico y convincente para atraer a los generadores adecuados en un marketplace B2B.

    DATOS DE LA NECESIDAD:
    - Tipo de Residuo Buscado: {{{residueType}}}
    - Categoría: {{{residueCategory}}}
    - Especificaciones Actuales: {{{needSpecifications}}}

    ANÁLISIS MEJORADO (en español):
  `,
});

const generateNeedDetailsFlow = ai.defineFlow(
  {
    name: 'generateNeedDetailsFlow',
    inputSchema: GenerateNeedDetailsInputSchema,
    outputSchema: GenerateNeedDetailsOutputSchema,
  },
  async input => {
    const { output } = await needDetailsPrompt(input);
    return output!;
  }
);
