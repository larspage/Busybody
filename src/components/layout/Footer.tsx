import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  useColorModeValue
} from '@chakra-ui/react';

export const Footer = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      py={4}
      borderTop="1px"
      borderTopColor={borderColor}
    >
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify="space-between"
          align="center"
        >
          <Text>© 2025 Busybody. All rights reserved</Text>
          <Stack direction="row" spacing={6}>
            <Link href="#" color="gray.600">Privacy</Link>
            <Link href="#" color="gray.600">Terms</Link>
            <Link href="#" color="gray.600">Contact</Link>
            <Link href="#" color="gray.600">About</Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};