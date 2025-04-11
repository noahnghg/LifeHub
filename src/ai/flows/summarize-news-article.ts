'use server';
/**
 * @fileOverview Summarizes news articles using AI.
 *
 * - summarizeNewsArticle - A function that summarizes a news article.
 * - SummarizeNewsArticleInput - The input type for the summarizeNewsArticle function.
 * - SummarizeNewsArticleOutput - The return type for the summarizeNewsArticle function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeNewsArticleInputSchema = z.object({
  articleUrl: z.string().describe('The URL of the news article to summarize.'),
  articleContent: z.string().describe('The content of the news article.'),
});
export type SummarizeNewsArticleInput = z.infer<typeof SummarizeNewsArticleInputSchema>;

const SummarizeNewsArticleOutputSchema = z.object({
  summary: z.string().describe('A short summary of the news article.'),
});
export type SummarizeNewsArticleOutput = z.infer<typeof SummarizeNewsArticleOutputSchema>;

export async function summarizeNewsArticle(
  input: SummarizeNewsArticleInput
): Promise<SummarizeNewsArticleOutput> {
  return summarizeNewsArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNewsArticlePrompt',
  input: {
    schema: z.object({
      articleUrl: z.string().describe('The URL of the news article to summarize.'),
      articleContent: z.string().describe('The content of the news article.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A short summary of the news article.'),
    }),
  },
  prompt: `Summarize the following news article in a concise manner.\n\nArticle URL: {{{articleUrl}}}\nArticle Content: {{{articleContent}}}`,
});

const summarizeNewsArticleFlow = ai.defineFlow<
  typeof SummarizeNewsArticleInputSchema,
  typeof SummarizeNewsArticleOutputSchema
>(
  {
    name: 'summarizeNewsArticleFlow',
    inputSchema: SummarizeNewsArticleInputSchema,
    outputSchema: SummarizeNewsArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
