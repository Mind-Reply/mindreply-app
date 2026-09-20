interface RealtimeVoiceTokenResponse {
  client_secret: {
    value: string;
    expires_at: number;
  };
}

export async function createRealtimeSession(): Promise<RealtimeVoiceTokenResponse> {
  const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-realtime-preview-2024-12-17',
      voice: 'alloy',
      instructions:
        'You are A11-K, a warm AI companion. Be concise and helpful. Speak naturally.',
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create realtime session: ${response.statusText}`);
  }

  return response.json();
}