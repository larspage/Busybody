import { ChakraProvider } from '@chakra-ui/react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../store';
import theme from '../theme';

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </ReduxProvider>
  );
}