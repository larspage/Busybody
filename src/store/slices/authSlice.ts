import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setLoading, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

// Async thunk for login
export const login = (email: string, password: string) => async (dispatch: any) => {
  dispatch(setLoading(true));
  try {
    // TODO: Implement actual login logic
    const mockUser: User = {
      id: '1',
      name: 'Test User',
      email,
    };
    dispatch(loginSuccess(mockUser));
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    dispatch(setLoading(false));
  }
};