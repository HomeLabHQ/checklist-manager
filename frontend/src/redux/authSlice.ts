/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { backendApi, User } from './api';

// Define a type for the slice state
interface AuthState {
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  access: localStorage.getItem('access') ?? null,
  refresh: localStorage.getItem('refresh') ?? null,
  isAuthenticated: !!localStorage.getItem('access'),
  user: null,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    refreshToken: (state, action) => {
      state.access = action.payload.access;
      localStorage.setItem('access', action.payload.access);
    },
    logout: (state) => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      state.access = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(backendApi.endpoints.authCreate.matchFulfilled, (state, { payload }) => {
      state.access = payload.access;
      state.refresh = payload.refresh;
      state.isAuthenticated = true;
      localStorage.setItem('access', payload.access);
      localStorage.setItem('refresh', payload.refresh);
    });
    builder.addMatcher(
      backendApi.endpoints.authProfileRetrieve.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
      }
    );
    builder.addMatcher(
      backendApi.endpoints.authRegisterConfirmCreate.matchFulfilled,
      (state, { payload }) => {
        state.access = payload.access;
        state.refresh = payload.refresh;
        state.isAuthenticated = true;
        localStorage.setItem('access', payload.access);
        localStorage.setItem('refresh', payload.refresh);
      }
    );
    builder.addMatcher(
      backendApi.endpoints.authSocialJwtPairCreate.matchFulfilled,
      (state, { payload }) => {
        state.access = payload.access;
        state.refresh = payload.refresh;
        state.isAuthenticated = true;
        localStorage.setItem('access', payload.access);
        localStorage.setItem('refresh', payload.refresh);
      }
    );
  },
});

export const { logout, refreshToken } = authSlice.actions;

export default authSlice.reducer;
