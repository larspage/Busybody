import { ReactNode } from 'react';
import { Box, Container, VStack, Image } from '@chakra-ui/react';
import { Footer } from './Footer';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Container maxW="container.sm" flex="1" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Logo/Brand */}
          <Box textAlign="center">
            <Image
              src="/logo.svg"
              alt="Busybody Logo"
              height="64px"
              mx="auto"
              fallbackSrc="https://via.placeholder.com/150x64?text=Busybody"
            />
          </Box>

          {/* Auth Form Container */}
          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            border="1px"
            borderColor="gray.100"
          >
            {children}
          </Box>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};