import { createAsyncThunk } from '@reduxjs/toolkit';
import type { EmployeeCreateRequest, PaginatedResponse, EmployeeResponse } from '../../types';
import * as employeeService from '../../services/employeeService';
import type { RootState } from '../store';

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (params: { pageNumber: number; pageSize: number; search?: string | undefined }, thunkAPI) => {
    const { pageNumber, pageSize, search } = params;
    const resp = await employeeService.getEmployees(pageNumber, pageSize, search);
    // return paginated response
    return resp as PaginatedResponse<EmployeeResponse>;
  }
);

export const createEmployeeThunk = createAsyncThunk(
  'employees/createEmployee',
  async (payload: EmployeeCreateRequest, thunkAPI) => {
    const created = await employeeService.createEmployee(payload);
    // after create, refresh list resetting to page 1
    const state = thunkAPI.getState() as RootState;
    const pageSize = state.employees.pageSize;
    await thunkAPI.dispatch(fetchEmployees({ pageNumber: 1, pageSize }));
    return created;
  }
);

export const updateEmployeeThunk = createAsyncThunk(
  'employees/updateEmployee',
  async (
    params: { id: string; payload: EmployeeCreateRequest },
    thunkAPI
  ) => {
    const { id, payload } = params;
    const updated = await employeeService.updateEmployee(id, payload);
    // refresh current page
    const state = thunkAPI.getState() as RootState;
    const pageNumber = state.employees.pageNumber;
    const pageSize = state.employees.pageSize;
    await thunkAPI.dispatch(fetchEmployees({ pageNumber, pageSize }));
    return updated;
  }
);

export const deleteEmployeeThunk = createAsyncThunk(
  'employees/deleteEmployee',
  async (id: string, thunkAPI) => {
    await employeeService.deleteEmployee(id);
    // after delete, check if we should move to previous page
    const state = thunkAPI.getState() as RootState;
    const pageNumber = state.employees.pageNumber;
    const pageSize = state.employees.pageSize;
    const currentCount = state.employees.employees.length;
    let newPage = pageNumber;
    if (currentCount === 1 && pageNumber > 1) {
      newPage = pageNumber - 1;
    }
    await thunkAPI.dispatch(fetchEmployees({ pageNumber: newPage, pageSize }));
    return id;
  }
);
