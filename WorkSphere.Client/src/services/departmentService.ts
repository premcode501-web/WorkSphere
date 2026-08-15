import { API_BASE_URL } from './config';
import type { Department, DepartmentCreateRequest, DepartmentUpdateRequest } from '../types';

const DEPARTMENT_ENDPOINT = '/api/Department';

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

export async function getDepartments(): Promise<Department[]> {
  const url = buildUrl(DEPARTMENT_ENDPOINT);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch departments: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? (data as Department[]) : [];
}

export async function getDepartmentById(id: string): Promise<Department> {
  const url = buildUrl(`${DEPARTMENT_ENDPOINT}/${id}`);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch department ${id}: ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as Department;
}

export async function createDepartment(payload: DepartmentCreateRequest): Promise<Department> {
  const url = buildUrl(DEPARTMENT_ENDPOINT);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create department: ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as Department;
}

export async function updateDepartment(id: string, payload: DepartmentUpdateRequest): Promise<Department> {
  const url = buildUrl(`${DEPARTMENT_ENDPOINT}/${id}`);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update department ${id}: ${res.status} ${res.statusText} ${text}`);
  }

  return (await res.json()) as Department;
}

export async function deleteDepartment(id: string): Promise<void> {
  const url = buildUrl(`${DEPARTMENT_ENDPOINT}/${id}`);

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to delete department ${id}: ${res.status} ${res.statusText} ${text}`);
  }
}
