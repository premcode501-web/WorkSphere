// Centralized Type exports for the app

export interface AppConfig {
  appName: string;
  version?: string;
}

// Employee and API response types (mirror backend DTOs)
export interface EmployeeResponse {
  id: string; // Guid from backend
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfJoining: string; // DateOnly serialized as ISO string
  isActive: boolean;
  departmentId: string;
  departmentName: string;
  departmentCode: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Shape used when creating/updating an employee from the client
export interface EmployeeCreateRequest {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfJoining: string; // ISO date (YYYY-MM-DD)
  departmentId: string;
  // departmentName and departmentCode are normally derived server-side from departmentId
}

export interface Department {
  id: string;
  name: string;
  code?: string;
}

// Dashboard summary counts returned by the backend
export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
}
