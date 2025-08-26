import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AppProvider } from './providers/AppProvider';

// Ensure proper color mode on initial load
const root = document.documentElement;
const initialColorMode = root.style.getPropertyValue('--initial-color-mode');
if (initialColorMode) {
  document.body.dataset.theme = initialColorMode;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);