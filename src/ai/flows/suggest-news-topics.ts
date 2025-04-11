// src/ai/flows/suggest-news-topics.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest news topics to the user based on their profile and past reading history.
 *
 * - suggestNewsTopics - A function that triggers the news topic suggestion flow.
 * - SuggestNewsTopicsInput - The input type for the suggestNewsTopics function.
 * - SuggestNewsTopicsOutput - The return type for the suggestNewsTopics function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestNewsTopicsInputSchema = z.object({
  userProfile: z.string().describe('A description of the user profile.'),
  readingHistory: z.string().describe('The user past reading history.'),
});
export type SuggestNewsTopicsInput = z.infer<typeof SuggestNewsTopicsInputSchema>;

const SuggestNewsTopicsOutputSchema = z.object({
  suggestedTopics: z.array(z.string()).describe('An array of suggested news topics based on the user profile and reading history.'),
});
export type SuggestNewsTopicsOutput = z.infer<typeof SuggestNewsTopicsOutputSchema>;

export async function suggestNewsTopics(input: SuggestNewsTopicsInput): Promise<SuggestNewsTopicsOutput> {
  return suggestNewsTopicsFlow(input);
}

const suggestNewsTopicsPrompt = ai.definePrompt({
  name: 'suggestNewsTopicsPrompt',
  input: {
    schema: z.object({
      userProfile: z.string().describe('A description of the user profile.'),
      readingHistory: z.string().describe('The user past reading history.'),
    }),
  },
  output: {
    schema: z.object({
      suggestedTopics: z.array(z.string()).describe('An array of suggested news topics based on the user profile and reading history.'),
    }),
  },
  prompt: `Based on the user profile: {{{userProfile}}} and their past reading history: {{{readingHistory}}}, suggest a list of news topics the user might be interested in.  Return an array of strings representing the suggested topics.`, 
});

const suggestNewsTopicsFlow = ai.defineFlow<
  typeof SuggestNewsTopicsInputSchema,
  typeof SuggestNewsTopicsOutputSchema
>({
  name: 'suggestNewsTopicsFlow',
  inputSchema: SuggestNewsTopicsInputSchema,
  outputSchema: SuggestNewsTopicsOutputSchema,
}, async input => {
  const {output} = await suggestNewsTopicsPrompt(input);
  return output!;
});
