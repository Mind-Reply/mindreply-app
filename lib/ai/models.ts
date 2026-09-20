import { type LanguageModel, createOpenAI } from '@ai-sdk/openai';

export function getModelProvider() {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openai;
}

export enum ModelId {
  GPT4o = 'gpt-4o',
  GPT4oMini = 'gpt-4o-mini',
  O3Mini = 'o3-mini',
  O4Mini = 'o4-mini',
}

export interface ModelOption {
  id: ModelId;
  name: string;
  description: string;
  requiresPro: boolean;
}

export const MODEL_OPTIONS: ModelOption[] = [
  { id: ModelId.GPT4oMini, name: 'GPT-4o Mini', description: 'Fast and capable', requiresPro: false },
  { id: ModelId.GPT4o, name: 'GPT-4o', description: 'Most capable model', requiresPro: false },
  { id: ModelId.O3Mini, name: 'o3-mini', description: 'Strong reasoning', requiresPro: false },
  { id: ModelId.O4Mini, name: 'o4-mini', description: 'Latest reasoning', requiresPro: false },
];

export function getModel(modelId: ModelId): LanguageModel {
  const provider = getModelProvider();

  switch (modelId) {
    case ModelId.GPT4o:
      return provider('gpt-4o');
    case ModelId.GPT4oMini:
      return provider('gpt-4o-mini');
    case ModelId.O3Mini:
      return provider('o3-mini');
    case ModelId.O4Mini:
      return provider('o4-mini');
    default:
      return provider('gpt-4o-mini');
  }
}

export function isReasoningModel(modelId: ModelId): boolean {
  return modelId === ModelId.O3Mini || modelId === ModelId.O4Mini;
}