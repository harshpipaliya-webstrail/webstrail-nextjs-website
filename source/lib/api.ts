// Single source of the backend API address: the API_URL environment variable (see .env).
// Server-side code uses this directly; the browser gets the same value from /api-config.js
// (app/api-config.js/route.ts), so nothing else hard-codes the address.
export const API_URL = (process.env.API_URL || '').replace(/\/+$/, '');

export const api = (path: string) => `${API_URL}${path}`;
