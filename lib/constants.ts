export const APP_NAME = 'A11-K';
export const APP_DESCRIPTION =
  'Voice-first AI companion by MindReply. Chat, create, and collaborate.';
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://chat.a11-k.space';

export const DEFAULT_CHAT_MODEL = 'gpt-4o-mini';

export const MAX_CHAT_MESSAGES = 100;

export const ARTIFACT_KINDS = ['text', 'code', 'image', 'sheet'] as const;
export type ArtifactKind = (typeof ARTIFACT_KINDS)[number];