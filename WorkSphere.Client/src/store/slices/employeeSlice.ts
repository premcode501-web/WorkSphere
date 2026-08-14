import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { EmployeeResponse, PaginatedResponse } from '../../types';
import { fetchEmployees, createEmployeeThunk, updateEmployeeThunk, deleteEmployeeThunk } from './employeeThunks';

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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEmployees.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<PaginatedResponse<EmployeeResponse>>) => {
      state.loading = false;
      state.error = null;
      state.employees = action.payload.items ?? [];
      state.totalCount = action.payload.totalCount ?? (action.payload.items?.length ?? 0);
      state.pageNumber = action.payload.pageNumber ?? state.pageNumber;
      state.pageSize = action.payload.pageSize ?? state.pageSize;
      state.totalPages = action.payload.totalPages ?? Math.max(1, Math.ceil(state.totalCount / Math.max(1, state.pageSize)));
    });

    builder.addCase(fetchEmployees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? 'Failed to load employees';
    });

    // create
    builder.addCase(createEmployeeThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createEmployeeThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(createEmployeeThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? 'Failed to create employee';
    });

    // update
    builder.addCase(updateEmployeeThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateEmployeeThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateEmployeeThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? 'Failed to update employee';
    });

    // delete
    builder.addCase(deleteEmployeeThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteEmployeeThunk.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deleteEmployeeThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? 'Failed to delete employee';
    });
  }
});

export const { setEmployees, setLoading, setError, setPageNumber, setPageSize, setTotalCount, setTotalPages, resetState } = employeeSlice.actions;
export default employeeSlice.reducer;