// services/index.ts
// Placeholder for service-layer functions (API clients, adapters).

export const noopService = () => {
  // No runtime work here yet — placeholder for later API integration
  return Promise.resolve(null);
};

// Re-export specific services for convenient imports
export { getEmployees } from './employeeService';
export { getDashboardSummary } from './dashboardService';
