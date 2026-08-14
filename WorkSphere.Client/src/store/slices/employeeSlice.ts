import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EmployeeResponse } from '../../types';

interface EmployeeState {
  employees: EmployeeResponse[];
  loading: boolean;
  error: string | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  pageNumber: 1,
  pageSize: 10,
  totalCount: 0,
  totalPages: 1,
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees(state, action: PayloadAction<EmployeeResponse[]>) {
      state.employees = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setPageNumber(state, action: PayloadAction<number>) {
      state.pageNumber = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setTotalCount(state, action: PayloadAction<number>) {
      state.totalCount = action.payload;
    },
    setTotalPages(state, action: PayloadAction<number>) {
      state.totalPages = action.payload;
    },
    resetState() {
      return initialState;
    }
  }
});

export const { setEmployees, setLoading, setError, setPageNumber, setPageSize, setTotalCount, setTotalPages, resetState } = employeeSlice.actions;
export default employeeSlice.reducer;
