CREATE TABLE IF NOT EXISTS "VoiceMemory" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id"),
  "content" text NOT NULL,
  "category" varchar(32) NOT NULL DEFAULT 'fact',
  "enabled" boolean NOT NULL DEFAULT true,
  "source" varchar(32) NOT NULL DEFAULT 'owner',
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "VoiceMemory_userId_idx" ON "VoiceMemory" ("userId");
CREATE INDEX IF NOT EXISTS "VoiceMemory_userId_enabled_idx" ON "VoiceMemory" ("userId", "enabled");
