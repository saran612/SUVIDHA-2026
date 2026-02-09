'use server';

/**
 * @fileOverview A Text-To-Speech (TTS) AI flow for kiosk voice instructions.
 *
 * - speakInstruction - A function that converts text to speech data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const SpeakInputSchema = z.string().describe('The instruction text to convert to speech.');

const SpeakOutputSchema = z.object({
  media: z.string().describe('A data URI for the generated audio in WAV format.'),
});

export type SpeakOutput = z.infer<typeof SpeakOutputSchema>;

/**
 * Converts PCM data to a Base64-encoded WAV data URI.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', (err) => {
      console.error('WAV conversion error:', err);
      reject(err);
    });
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const speakFlow = ai.defineFlow(
  {
    name: 'speakFlow',
    inputSchema: SpeakInputSchema,
    outputSchema: SpeakOutputSchema,
  },
  async (text) => {
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-preview-tts',
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: text,
      });

      if (!media || !media.url) {
        throw new Error('No audio media returned from AI model.');
      }

      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );

      const wavBase64 = await toWav(audioBuffer);
      
      return {
        media: 'data:audio/wav;base64,' + wavBase64,
      };
    } catch (error: any) {
      // Graceful fallback for quota limits (429 Too Many Requests)
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        console.warn('TTS Quota exceeded or rate limited. Falling back to silent mode.');
        return { media: '' };
      }
      
      console.error('TTS Flow error:', error);
      throw error;
    }
  }
);

export async function speakInstruction(text: string): Promise<SpeakOutput> {
  return speakFlow(text);
}
