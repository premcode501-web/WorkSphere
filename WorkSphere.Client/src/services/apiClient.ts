export interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
}

const STORAGE_KEY = 'worksphere.auth';

export async function apiRequest(
  input: RequestInfo | URL,
  options: ApiRequestOptions = {},
): Promise<Response> {
  const { authenticated = true, headers, ...requestInit } = options;
  const requestHeaders = new Headers(headers);

  if (authenticated) {
    const token = readToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(input, {
    ...requestInit,
    headers: requestHeaders,
  });

  if (response.status === 401 && authenticated) {
    const [{ store }, { logout }] = await Promise.all([
      import('../store/store'),
      import('../store/slices/authSlice'),
    ]);
    store.dispatch(logout());
    if (window.location.pathname !== '/login') {
      window.location.assign('/login');
    }
  }

  return response;
}

function readToken(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { token?: unknown };
    return typeof parsed.token === 'string' && parsed.token.length > 0
      ? parsed.token
      : null;
  } catch {
    return null;
  }
}
