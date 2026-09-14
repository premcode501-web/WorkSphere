import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Department, DepartmentCreateRequest, DepartmentUpdateRequest } from '../../types';
import * as departmentService from '../../services/departmentService';

interface DepartmentState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentState = {
  departments: [],
  loading: false,
  error: null,
};

// Async thunks using the existing service functions
export const fetchDepartments = createAsyncThunk<Department[], void, { rejectValue: string }>(
  'departments/fetchDepartments',
  async (_, thunkAPI) => {
    try {
      const data = await departmentService.getDepartments();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : 'Failed to fetch departments');
    }
  }
);

export const createDepartment = createAsyncThunk<Department, DepartmentCreateRequest, { rejectValue: string }>(
  'departments/createDepartment',
  async (payload, thunkAPI) => {
    try {
      const created = await departmentService.createDepartment(payload);
      return created;
    } catch (err) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : 'Failed to create department');
    }
  }
);

export const updateDepartment = createAsyncThunk<Department, { id: string; payload: DepartmentUpdateRequest }, { rejectValue: string }>(
  'departments/updateDepartment',
  async ({ id, payload }, thunkAPI) => {
    try {
      const updated = await departmentService.updateDepartment(id, payload);
      return updated;
    } catch (err) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : `Failed to update department ${id}`);
    }
  }
);

export const deleteDepartment = createAsyncThunk<string, string, { rejectValue: string }>(
  'departments/deleteDepartment',
  async (id, thunkAPI) => {
    try {
      await departmentService.deleteDepartment(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err instanceof Error ? err.message : `Failed to delete department ${id}`);
    }
  }
);

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder.addCase(fetchDepartments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
      state.departments = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchDepartments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Failed to fetch departments';
    });

    // create
    builder.addCase(createDepartment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
      state.departments.push(action.payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(createDepartment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Failed to create department';
    });

    // update
    builder.addCase(updateDepartment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
      const idx = state.departments.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.departments[idx] = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateDepartment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Failed to update department';
    });

    // delete
    builder.addCase(deleteDepartment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteDepartment.fulfilled, (state, action: PayloadAction<string>) => {
      state.departments = state.departments.filter((d) => d.id !== action.payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deleteDepartment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? action.error.message ?? 'Failed to delete department';
    });
  },
});

export default departmentSlice.reducer;