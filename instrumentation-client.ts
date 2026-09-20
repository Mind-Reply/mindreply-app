import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel('a11k-surface');
}
