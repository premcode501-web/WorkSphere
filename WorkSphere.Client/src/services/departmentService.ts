import { API_BASE_URL } from './config';
import type { Department } from '../types';

const DEPARTMENT_ENDPOINT = '/api/Department';

function buildUrl(path: string) {
  return new URL(path, API_BASE_URL || window.location.origin).toString();
}

export async function getDepartments(): Promise<Department[]> {
  const url = buildUrl(DEPARTMENT_ENDPOINT);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch departments: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data as Department[];
}
