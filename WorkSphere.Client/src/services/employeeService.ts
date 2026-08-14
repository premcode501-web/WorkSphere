import { API_BASE_URL } from './config';
import type { EmployeeResponse, PaginatedResponse, EmployeeCreateRequest } from '../types';

const EMPLOYEE_ENDPOINT = '/api/Employee';

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

export async function getEmployees(
  pageNumber: number,
  pageSize: number,
  search?: string
): Promise<PaginatedResponse<EmployeeResponse>> {
  const url = buildUrl(EMPLOYEE_ENDPOINT, { pageNumber, pageSize, search });

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch employees: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();

  // Backend currently returns a plain array of employees (see WebAPI).
  // If the API eventually returns a paginated shape, accept it directly.
  if (Array.isArray(data)) {
    const items = data as EmployeeResponse[];
    const totalCount = items.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / Math.max(1, pageSize)));
    return {
      items,
      totalCount,
      pageNumber,
      pageSize,
      totalPages
    };
  }

  // Otherwise, assume the response matches PaginatedResponse<EmployeeResponse>
  return data as PaginatedResponse<EmployeeResponse>;
}

export async function createEmployee(payload: EmployeeCreateRequest): Promise<EmployeeResponse> {
  const url = buildUrl(EMPLOYEE_ENDPOINT);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to create employee: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data as EmployeeResponse;
}

export async function getEmployee(id: string): Promise<EmployeeResponse> {
  const url = buildUrl(`${EMPLOYEE_ENDPOINT}/${id}`);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch employee ${id}: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data as EmployeeResponse;
}

export async function updateEmployee(id: string, payload: EmployeeCreateRequest): Promise<EmployeeResponse> {
  const url = buildUrl(`${EMPLOYEE_ENDPOINT}/${id}`);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to update employee ${id}: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  return data as EmployeeResponse;
}
