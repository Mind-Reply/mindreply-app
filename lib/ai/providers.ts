import { type LanguageModel, createOpenAI } from '@ai-sdk/openai';

export function getProvider() {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openai;
}