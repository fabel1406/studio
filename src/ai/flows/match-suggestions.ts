// src/ai/flows/match-suggestions.ts
'use server';

/**
 * @fileOverview An AI agent that suggests matches between residues and transformers.
 *
 * - getMatchSuggestions - A function that suggests residue matches for a transformer.
 * - MatchSuggestionsInput - The input type for the getMatchSuggestions function.
 * - MatchSuggestionsOutput - The return type for the getMatchSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type { Residue, Need, Company } from '@/lib/types';
import { mockCompanies } from '@/lib/data';

// Define Zod schemas for our main data types to use in the flow
const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

const ResidueSchema = z.object({
    id: z.string(),
    companyId: z.string(),
    type: z.string(),
    category: z.enum(['BIOMASS', 'FOOD', 'AGRO', 'OTHERS']),
    quantity: z.number(),
    unit: z.enum(['KG', 'TON']),
    company: CompanySchema.optional(),
});

const NeedSchema = z.object({
    id: z.string(),
    companyId: z.string(),
    residueType: z.string(),
    category: z.enum(['BIOMASS', 'FOOD', 'AGRO', 'OTHERS']),
    quantity: z.number(),
    unit: z.enum(['KG', 'TON']),
    frequency: z.enum(['ONCE', 'WEEKLY', 'MONTHLY']),
    company: CompanySchema.optional(),
});


const MatchSuggestionsInputSchema = z.union([
    z.object({
        matchType: z.literal('findTransformers'),
        sourceResidue: ResidueSchema,
        availableNeeds: z.array(NeedSchema),
    }),
    z.object({
        matchType: z.literal('findGenerators'),
        sourceNeed: NeedSchema,
        availableResidues: z.array(ResidueSchema),
    })
]);
export type MatchSuggestionsInput = z.infer<typeof MatchSuggestionsInputSchema>;


const MatchSchema = z.object({
    sourceId: z.string().describe("The ID of the need or residue being matched."),
    matchedId: z.string().describe("The ID of the matched residue or need."),
    score: z.number().describe('A score between 0.0 and 1.0 indicating the suitability of the match.'),
    reason: z.string().describe('The reason for the suggestion, highlighting key matching factors.'),
    company: CompanySchema.optional().describe("The company associated with the match.")
});

const MatchSuggestionsOutputSchema = z.object({
  suggestions: z.array(MatchSchema).describe('A list of suggested matches.'),
});
export type MatchSuggestionsOutput = z.infer<typeof MatchSuggestionsOutputSchema>;

export async function getMatchSuggestions(input: MatchSuggestionsInput): Promise<MatchSuggestionsOutput> {
  const result = await matchSuggestionsFlow(input);
  
  // Hydrate company details into the suggestions
  const hydratedSuggestions = result.suggestions.map(suggestion => {
    let company: Company | undefined;
    if (input.matchType === 'findTransformers') {
        const need = input.availableNeeds.find(n => n.id === suggestion.matchedId);
        company = need?.company;
    } else { // findGenerators
        const residue = input.availableResidues.find(r => r.id === suggestion.matchedId);
        company = residue?.company;
    }
    return { ...suggestion, ...suggestion.company, company };
  });

  return { suggestions: hydratedSuggestions };
}

const findTransformersPrompt = ai.definePrompt({
  name: 'findTransformersPrompt',
  input: {
    schema: z.object({
      sourceResidue: ResidueSchema,
      availableNeeds: z.array(NeedSchema),
    }),
  },
  output: { schema: MatchSuggestionsOutputSchema },
  prompt: `
    Eres un agente de matchmaking experto para un marketplace B2B de residuos orgánicos.
    Tu objetivo es ayudar a un GENERADOR DE RESIDUOS a encontrar las mejores empresas TRANSFORMADORAS que necesiten su residuo.
    Tu respuesta SIEMPRE debe estar en español.

    Se te proporcionará un "Residuo de Origen" y una lista de "Necesidades Disponibles" de empresas transformadoras.

    Analiza la lista de necesidades y compáralas con el residuo de origen.
    - Encuentra hasta 3 de las mejores coincidencias.
    - Para cada coincidencia, proporciona una puntuación de 0.0 (peor) a 1.0 (mejor).
    - La puntuación debe basarse en:
      1. Tipo/Categoría de Residuo: Debe ser una coincidencia muy cercana o exacta. Este es el factor más importante.
      2. Ubicación: Una mayor proximidad geográfica (basada en país, ciudad, o dirección si están disponibles) resulta en una puntuación más alta. Valora más las coincidencias en la misma ciudad, luego en el mismo país.
      3. Cantidad: Una coincidencia cercana entre la cantidad del residuo y la cantidad de la necesidad es mejor.

    Tu respuesta debe incluir el ID del residuo de origen, el ID de la necesidad coincidente, la puntuación, una razón breve y convincente para la coincidencia y la información de la empresa (company) de la necesidad coincidente.
    Destaca en la razón los factores clave que la convierten en una buena coincidencia.

    Residuo de Origen:
    {{{json sourceResidue}}}

    Necesidades Disponibles de Transformadores:
    {{{json availableNeeds}}}
  `,
});

const findGeneratorsPrompt = ai.definePrompt({
  name: 'findGeneratorsPrompt',
  input: {
    schema: z.object({
      sourceNeed: NeedSchema,
      availableResidues: z.array(ResidueSchema),
    }),
  },
  output: { schema: MatchSuggestionsOutputSchema },
  prompt: `
    Eres un agente de matchmaking experto para un marketplace B2B de residuos orgánicos.
    Tu objetivo es ayudar a una empresa TRANSFORMADORA a encontrar los mejores GENERADORES DE RESIDUOS para sus necesidades.
    Tu respuesta SIEMPRE debe estar en español.

    Se te proporcionará una "Necesidad de Origen" y una lista de "Residuos Disponibles" de empresas generadoras.

    Analiza la lista de residuos y compáralos con la necesidad de origen.
    - Encuentra hasta 3 de las mejores coincidencias.
    - Para cada coincidencia, proporciona una puntuación de 0.0 (peor) a 1.0 (mejor).
    - La puntuación debe basarse en:
      1. Tipo/Categoría de Residuo: Debe ser una coincidencia muy cercana o exacta. Este es el factor más importante.
      2. Ubicación: Una mayor proximidad geográfica (basada en país, ciudad, o dirección si están disponibles) resulta en una puntuación más alta. Valora más las coincidencias en la misma ciudad, luego en el mismo país.
      3. Cantidad: La cantidad disponible del residuo debe ser suficiente para satisfacer la necesidad.

    Tu respuesta debe incluir el ID de la necesidad de origen, el ID del residuo coincidente, la puntuación, una razón breve y convincente para la coincidencia y la información de la empresa (company) del residuo coincidente.
    Destaca en la razón los factores clave que la convierten en una buena coincidencia.

    Necesidad de Origen:
    {{{json sourceNeed}}}

    Residuos Disponibles de Generadores:
    {{{json availableResidues}}}
  `,
});

const matchSuggestionsFlow = ai.defineFlow(
  {
    name: 'matchSuggestionsFlow',
    inputSchema: MatchSuggestionsInputSchema,
    outputSchema: MatchSuggestionsOutputSchema,
  },
  async (input) => {
    if (input.matchType === 'findTransformers') {
      const { output } = await findTransformersPrompt({
        sourceResidue: input.sourceResidue,
        availableNeeds: input.availableNeeds,
      });
      return output!;
    } else {
      const { output } = await findGeneratorsPrompt({
        sourceNeed: input.sourceNeed,
        availableResidues: input.availableResidues,
      });
      return output!;
    }
  }
);
