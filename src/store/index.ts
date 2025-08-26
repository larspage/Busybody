import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Typed selectors for better type inference
export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return {
    ...auth,
    login: (email: string, password: string) => dispatch(authReducer.actions.login(email, password)),
    logout: () => dispatch(authReducer.actions.logout()),
  };
};

export const useUI = () => {
  const ui = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  return {
    ...ui,
    toggleColorMode: () => dispatch(uiReducer.actions.toggleColorMode()),
    toggleSidebar: () => dispatch(uiReducer.actions.toggleSidebar()),
    setSidebarOpen: (isOpen: boolean) => dispatch(uiReducer.actions.setSidebarOpen(isOpen)),
  };
};