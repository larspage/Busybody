export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface UIState {
  colorMode: 'light' | 'dark';
  sidebarOpen: boolean;
}

export interface AppState {
  auth: AuthState;
  ui: UIState;
}