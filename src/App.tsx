import { Box, Container, Heading, useColorMode } from '@chakra-ui/react';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { useAuth, useUI } from './store';

export function App() {
  const { isAuthenticated, user } = useAuth();
  const { colorMode, toggleColorMode } = useUI();
  
  return (
    <Box minH="100vh" bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}>
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <Container maxW="container.sm" py={8}>
          <Box p={6} bg={colorMode === 'dark' ? 'gray.700' : 'white'} borderRadius="md" shadow="md">
            <Heading size="lg" mb={6} textAlign="center">
              Sign In
            </Heading>
            <LoginForm />
          </Box>
        </Container>
      )}
    </Box>
  );
}