import { generateId } from '../utils';
import type { VoiceMemory } from '../types';

const memories: Map<string, VoiceMemory[]> = new Map();

export function getVoiceMemories(userId: string, category?: string): VoiceMemory[] {
  const userMemories = memories.get(userId) || [];
  if (category) {
    return userMemories.filter((m) => m.category === category);
  }
  return userMemories;
}

export function setVoiceMemory(
  userId: string,
  key: string,
  value: string,
  category: string = 'general',
): VoiceMemory {
  const userMemories = memories.get(userId) || [];
  const existing = userMemories.find((m) => m.key === key && m.category === category);
  const now = new Date();

  if (existing) {
    existing.value = value;
    existing.updatedAt = now;
    return existing;
  }

  const memory: VoiceMemory = {
    id: generateId(),
    userId,
    key,
    value,
    category,
    createdAt: now,
    updatedAt: now,
  };

  userMemories.push(memory);
  memories.set(userId, userMemories);
  return memory;
}

export function deleteVoiceMemory(userId: string, key: string, category?: string): boolean {
  const userMemories = memories.get(userId);
  if (!userMemories) return false;

  const index = userMemories.findIndex(
    (m) => m.key === key && (!category || m.category === category),
  );

  if (index === -1) return false;

  userMemories.splice(index, 1);
  return true;
}