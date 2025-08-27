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
import {z} from 'genkit';
import type { Residue, Need, Company } from '@/lib/types';
import { mockCompanies } from '@/lib/data';

// Define Zod schemas for our main data types to use in the flow
const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
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
        company = mockCompanies.find(c => c.id === need?.companyId);
    } else { // findGenerators
        const residue = input.availableResidues.find(r => r.id === suggestion.matchedId);
        company = mockCompanies.find(c => c.id === residue?.companyId);
    }
    return { ...suggestion, company };
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
    You are an expert AI matchmaking agent for a B2B marketplace for organic waste.
    Your goal is to help a RESIDUE GENERATOR find the best TRANSFORMER companies who need their residue.

    You will be given a "Source Residue" and a list of "Available Needs" from transformer companies.

    Analyze the list of needs and compare them against the source residue.
    - Find up to 3 best matches.
    - For each match, provide a score from 0.0 (worst) to 1.0 (best).
    - The score should be based on:
      1. Residue Type/Category: Must be a very close or exact match. This is the most important factor.
      2. Location: Closer proximity (based on city/country, or lat/lng if available) results in a higher score.
      3. Quantity: A closer match between residue quantity and need quantity is better.

    Your response must include the ID of the source residue, the ID of the matched need, the score, and a brief, compelling reason for the match.
    Highlight the key factors that make it a good match in the reason.

    Source Residue:
    {{{json sourceResidue}}}

    Available Needs from Transformers:
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
    You are an expert AI matchmaking agent for a B2B marketplace for organic waste.
    Your goal is to help a TRANSFORMER company find the best RESIDUE GENERATORS for their needs.

    You will be given a "Source Need" and a list of "Available Residues" from generator companies.

    Analyze the list of residues and compare them against the source need.
    - Find up to 3 best matches.
    - For each match, provide a score from 0.0 (worst) to 1.0 (best).
    - The score should be based on:
      1. Residue Type/Category: Must be a very close or exact match. This is the most important factor.
      2. Location: Closer proximity (based on city/country, or lat/lng if available) results in a higher score.
      3. Quantity: The residue's available quantity should be sufficient to meet the need.

    Your response must include the ID of the source need, the ID of the matched residue, the score, and a brief, compelling reason for the match.
    Highlight the key factors that make it a good match in the reason.

    Source Need:
    {{{json sourceNeed}}}

    Available Residues from Generators:
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
