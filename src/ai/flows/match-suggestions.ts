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

const MatchSuggestionsInputSchema = z.object({
  transformerCompanyId: z.string().describe('The ID of the transformer company.'),
  residueType: z.string().describe('The type of residue the transformer is looking for.'),
  locationLat: z.number().describe('The latitude of the transformer company.'),
  locationLng: z.number().describe('The longitude of the transformer company.'),
  quantityNeeded: z.number().describe('The quantity of residue needed by the transformer.'),
});
export type MatchSuggestionsInput = z.infer<typeof MatchSuggestionsInputSchema>;

const MatchSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      residueId: z.string().describe('The ID of the suggested residue.'),
      score: z.number().describe('A score between 0.0 and 1.0 indicating the suitability of the match.'),
      reason: z.string().describe('The reason for the suggestion.'),
    })
  ).describe('A list of suggested residue matches for the transformer.'),
});
export type MatchSuggestionsOutput = z.infer<typeof MatchSuggestionsOutputSchema>;

export async function getMatchSuggestions(input: MatchSuggestionsInput): Promise<MatchSuggestionsOutput> {
  return matchSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchSuggestionsPrompt',
  input: {schema: MatchSuggestionsInputSchema},
  output: {schema: MatchSuggestionsOutputSchema},
  prompt: `You are an AI assistant helping a transformer company find suitable residue matches.

  Based on the following information about the transformer and the residue they need, suggest the best residue matches.

  Transformer Company ID: {{{transformerCompanyId}}}
  Residue Type Needed: {{{residueType}}}
  Location (Latitude): {{{locationLat}}}
  Location (Longitude): {{{locationLng}}}
  Quantity Needed: {{{quantityNeeded}}}

  Provide a list of suggestions, each including the residue ID, a score indicating the suitability of the match (from 0.0 for a bad match to 1.0 for a perfect match), and a reason for the suggestion.
  `,
});

const matchSuggestionsFlow = ai.defineFlow(
  {
    name: 'matchSuggestionsFlow',
    inputSchema: MatchSuggestionsInputSchema,
    outputSchema: MatchSuggestionsOutputSchema,
  },
  async input => {
    // In a real app, you would fetch all available residues from a database here
    // and pass them to the prompt to get more accurate suggestions.
    const {output} = await prompt(input);
    return output!;
  }
);