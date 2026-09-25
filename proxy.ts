import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/api/chat', '/api/messages'],
};

export default function proxy(request: Request) {
  return NextResponse.next({ request });
}
