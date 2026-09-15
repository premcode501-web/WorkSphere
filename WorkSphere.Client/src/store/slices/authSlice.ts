import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../../services/authService';
import type { LoginRequest, LoginResponse } from '../../services/authService';

export type { LoginRequest, LoginResponse };

export interface AuthState {
  token: string | null;
  userId: string | null;
  userName: string | null;
  email: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'worksphere.auth';

function loadInitialState(): AuthState {
  const emptyState: AuthState = {
    token: null,
    userId: null,
    userName: null,
    email: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyState;
    const parsed = JSON.parse(stored) as Partial<AuthState>;
    if (!parsed.token || !parsed.userId || !parsed.userName || !parsed.email) return emptyState;
    return {
      ...emptyState,
      token: parsed.token,
      userId: parsed.userId,
      userName: parsed.userName,
      email: parsed.email,
      isAuthenticated: true,
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return emptyState;
  }
}

function persistState(state: AuthState) {
  if (!state.token || !state.userId || !state.userName || !state.email) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    token: state.token,
    userId: state.userId,
    userName: state.userName,
    email: state.email,
  }));
}

export const loginUser = createAsyncThunk<LoginResponse, LoginRequest, { rejectValue: string }>(
  'auth/loginUser',
  async (request, { rejectWithValue }) => {
    try {
      return await authService.login(request);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to sign in.');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.userName = null;
      state.email = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.error = null;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
        state.email = action.payload.email;
        state.isAuthenticated = true;
        persistState(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unable to sign in.';
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
