/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { backendApi } from './api';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    access: localStorage.getItem('access') ?? null,
    refresh: localStorage.getItem('refresh') ?? null,
    isAuthenticated: !!localStorage.getItem('access'),
    user: {},
  },

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
      state.user = {};
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
        console.log(payload);
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
