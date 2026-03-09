'use server';
/**
 * @fileOverview A Genkit flow for generating comprehensive and engaging service descriptions.
 *
 * - generateServiceDescription - A function that handles the service description generation process.
 * - ServiceDescriptionGeneratorInput - The input type for the generateServiceDescription function.
 * - ServiceDescriptionGeneratorOutput - The return type for the generateServiceDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ServiceDescriptionGeneratorInputSchema = z.object({
  serviceInput: z
    .string()
    .describe(
      'Keywords or a brief outline describing the service for which a description is needed.'
    ),
});
export type ServiceDescriptionGeneratorInput = z.infer<
  typeof ServiceDescriptionGeneratorInputSchema
>;

const ServiceDescriptionGeneratorOutputSchema = z.object({
  description: z
    .string()
    .describe('A comprehensive and engaging description of the service.'),
});
export type ServiceDescriptionGeneratorOutput = z.infer<
  typeof ServiceDescriptionGeneratorOutputSchema
>;

export async function generateServiceDescription(
  input: ServiceDescriptionGeneratorInput
): Promise<ServiceDescriptionGeneratorOutput> {
  return generateServiceDescriptionFlow(input);
}

const generateServiceDescriptionPrompt = ai.definePrompt({
  name: 'generateServiceDescriptionPrompt',
  input: {schema: ServiceDescriptionGeneratorInputSchema},
  output: {schema: ServiceDescriptionGeneratorOutputSchema},
  prompt: `You are an expert marketing copywriter specializing in creating clear, comprehensive, and engaging service descriptions for various businesses.

Your task is to generate a detailed service description based on the provided keywords or brief outline. The description should be compelling, highlight key benefits, and clearly explain what the service entails to potential customers. Aim for a professional yet accessible tone.

Input: {{{serviceInput}}}

Generate the service description in the following JSON format:
{
  "description": "[Generated service description]"
}`,
});

const generateServiceDescriptionFlow = ai.defineFlow(
  {
    name: 'generateServiceDescriptionFlow',
    inputSchema: ServiceDescriptionGeneratorInputSchema,
    outputSchema: ServiceDescriptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await generateServiceDescriptionPrompt(input);
    return output!;
  }
);
