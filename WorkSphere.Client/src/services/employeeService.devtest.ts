// TEMP DEV TEST — remove this file after verification
// This file intentionally exercises employeeService.getEmployees(1, 10)
// and logs results to the browser console. It runs only in development when
// imported from main.tsx via import.meta.env.DEV.

import { getEmployees } from './employeeService';

(async () => {
  console.log('[DEV TEST] employeeService.getEmployees starting');
  try {
    const result = await getEmployees(1, 10);
    console.log('[DEV TEST] employeeService.getEmployees result:', result);
  } catch (err) {
    console.error('[DEV TEST] employeeService.getEmployees error:', err);
  } finally {
    console.log('[DEV TEST] employeeService.getEmployees completed');
  }
})();
