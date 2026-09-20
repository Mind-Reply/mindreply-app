import { BotID } from 'botid';

export const botid = new BotID({
  enabled: process.env.NODE_ENV === 'production',
  token: process.env.BOTID_SECRET,
  mode: 'challenge',
  paths: ['/api/chat', '/api/messages'],
});

export const config = {
  matcher: ['/api/chat', '/api/messages'],
};

export async function middleware(request: Request) {
  if (process.env.NODE_ENV !== 'production' || !process.env.BOTID_SECRET) {
    return;
  }

  return botid.middleware(request);
}
