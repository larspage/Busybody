import { Box, Container, Heading, useColorMode } from '@chakra-ui/react';
import { LoginForm } from './components/auth/LoginForm';
import { useAuth, useUI } from './store';

export function App() {
  const { isAuthenticated, user } = useAuth();
  const { colorMode, toggleColorMode } = useUI();
  
  return (
    <Box minH="100vh" bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}>
      <Container maxW="container.sm" py={8}>
        {isAuthenticated ? (
          <Box p={6} bg={colorMode === 'dark' ? 'gray.700' : 'white'} borderRadius="md" shadow="md">
            <Heading size="md" mb={4}>
              Welcome, {user?.name}!
            </Heading>
          </Box>
        ) : (
          <Box p={6} bg={colorMode === 'dark' ? 'gray.700' : 'white'} borderRadius="md" shadow="md">
            <Heading size="lg" mb={6} textAlign="center">
              Sign In
            </Heading>
            <LoginForm />
          </Box>
        )}
      </Container>
    </Box>
  );
}