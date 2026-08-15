import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { DashboardSummary } from '../../types';
import * as dashboardService from '../../services/dashboardService';

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: null,
  loading: false,
  error: null
};

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async (_, _thunkAPI) => {
    const resp = await dashboardService.getDashboardSummary();
    return resp as DashboardSummary;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardSummary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchDashboardSummary.fulfilled, (state, action: PayloadAction<DashboardSummary>) => {
      state.loading = false;
      state.error = null;
      state.summary = action.payload;
    });

    builder.addCase(fetchDashboardSummary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? 'Failed to load dashboard summary';
      state.summary = null;
    });
  }
});

export default dashboardSlice.reducer;
