import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
import dashboardReducer from './slices/dashboardSlice';
import departmentReducer from './slices/departmentSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
    dashboard: dashboardReducer,
    departments: departmentReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
