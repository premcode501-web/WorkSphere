import { API_BASE_URL } from './config';
import { apiRequest } from './apiClient';
import type { DashboardSummary } from '../types';

const DASHBOARD_ENDPOINT = 'api/Dashboard/summary';

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, API_BASE_URL || window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }
  return url.toString();
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // Backend is expected to expose a dashboard summary endpoint at /api/Dashboard
  const url = buildUrl(DASHBOARD_ENDPOINT);

  const res = await apiRequest(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch dashboard summary: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data as DashboardSummary;
}
