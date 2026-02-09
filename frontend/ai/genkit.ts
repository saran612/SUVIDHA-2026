import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const googleAIPlugin = googleAI();

export const ai = genkit({
  plugins: [googleAIPlugin],
  model: 'googleai/gemini-2.5-flash',
});
