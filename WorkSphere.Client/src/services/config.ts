// Centralized service configuration. Uses Vite environment variable VITE_API_BASE_URL.
// Set VITE_API_BASE_URL in your .env (e.g., VITE_API_BASE_URL=http://localhost:5000)

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? '';