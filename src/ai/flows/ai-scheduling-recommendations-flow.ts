'use server';
/**
 * @fileOverview A Genkit flow for providing AI-powered scheduling recommendations based on service descriptions.
 *
 * - aiSchedulingRecommendations - A function that handles the AI scheduling recommendations process.
 * - AISchedulingRecommendationsInput - The input type for the aiSchedulingRecommendations function.
 * - AISchedulingRecommendationsOutput - The return type for the aiSchedulingRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISchedulingRecommendationsInputSchema = z.object({
  serviceDescription: z
    .string()
    .describe('A detailed description of the service for which to generate booking recommendations.'),
});
export type AISchedulingRecommendationsInput = z.infer<
  typeof AISchedulingRecommendationsInputSchema
>;

const AISchedulingRecommendationsOutputSchema = z.object({
  suggestedDurationMinutes: z
    .number()
    .int()
    .positive()
    .describe('The suggested duration for a single booking slot in minutes.'),
  suggestedCapacity: z
    .number()
    .int()
    .min(1)
    .max(6)
    .describe('The suggested maximum number of people that can be booked into a single slot (1-6).'),
  suggestedBufferMinutes: z
    .number()
    .int()
    .min(0)
    .describe('The suggested buffer time in minutes required between appointments.'),
  explanation: z
    .string()
    .describe('A detailed explanation for the generated recommendations.'),
});
export type AISchedulingRecommendationsOutput = z.infer<
  typeof AISchedulingRecommendationsOutputSchema
>;

export async function aiSchedulingRecommendations(
  input: AISchedulingRecommendationsInput
): Promise<AISchedulingRecommendationsOutput> {
  return aiSchedulingRecommendationsFlow(input);
}

const aiSchedulingRecommendationsPrompt = ai.definePrompt({
  name: 'aiSchedulingRecommendationsPrompt',
  input: {schema: AISchedulingRecommendationsInputSchema},
  output: {schema: AISchedulingRecommendationsOutputSchema},
  prompt: `You are an expert scheduling and booking optimization AI assistant.
Your task is to analyze a given service description and provide optimal booking parameters.
These parameters include the suggested duration for a booking slot, the maximum capacity per slot (up to 6 people),
and the recommended buffer time in minutes between appointments.

Always provide an explanation for your recommendations.

Service Description: {{{serviceDescription}}}

Based on the service description, please provide the following recommendations:
`,
});

const aiSchedulingRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiSchedulingRecommendationsFlow',
    inputSchema: AISchedulingRecommendationsInputSchema,
    outputSchema: AISchedulingRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await aiSchedulingRecommendationsPrompt(input);
    return output!;
  }
);
