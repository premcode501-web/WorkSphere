import { API_BASE_URL } from './config';
import { apiRequest } from './apiClient';

export interface LoginRequest {
  email?: string;
  userName?: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
}

const AUTH_ENDPOINT = '/api/Auth/login';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const url = new URL(AUTH_ENDPOINT, API_BASE_URL || window.location.origin);
  const response = await apiRequest(url, {
    authenticated: false,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let message = 'Unable to sign in. Please check your credentials.';
    try {
      const body = await response.json() as { message?: string; title?: string };
      message = body.message ?? body.title ?? message;
    } catch {
      // Keep the user-friendly fallback when the API has no JSON error body.
    }
    throw new Error(message);
  }

  return await response.json() as LoginResponse;
}
