import { ReactNode } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />

      <Grid flex={1} templateColumns={{ base: '1fr', md: '250px 1fr' }} gap={4}>
        <GridItem
          display={{ base: 'none', md: 'block' }}
          borderRightWidth="1px"
          borderRightColor="gray.200"
        >
          <Sidebar />
        </GridItem>

        <GridItem p={4} bg="gray.50">
          {children}
        </GridItem>
      </Grid>

      <Footer />
    </Box>
  );
};