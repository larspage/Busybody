import { ReactNode } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Container,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading
} from '@chakra-ui/react';
import { Layout } from './Layout';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  breadcrumbs?: Array<{
    label: string;
    href: string;
  }>;
}

export const DashboardLayout = ({
  children,
  title,
  breadcrumbs = []
}: DashboardLayoutProps) => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Layout>
      <Box bg={bgColor} minH="100%" py={6}>
        <Container maxW="container.xl">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <Breadcrumb mb={4}>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index} isCurrentPage={index === breadcrumbs.length - 1}>
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              ))}
            </Breadcrumb>
          )}

          {/* Page Title */}
          <Heading as="h1" size="lg" mb={6}>
            {title}
          </Heading>

          {/* Dashboard Content */}
          <Box
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="lg"
            bg={useColorModeValue('white', 'gray.700')}
            shadow="sm"
            p={6}
          >
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)'
              }}
              gap={6}
            >
              {children}
            </Grid>
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

// Utility component for dashboard grid items
interface DashboardGridItemProps {
  children: ReactNode;
  colSpan?: { base?: number; md?: number; lg?: number; xl?: number };
}

export const DashboardGridItem = ({
  children,
  colSpan = { base: 1, md: 1, lg: 1, xl: 1 }
}: DashboardGridItemProps) => {
  return (
    <GridItem
      colSpan={{
        base: colSpan.base || 1,
        md: colSpan.md || colSpan.base || 1,
        lg: colSpan.lg || colSpan.md || colSpan.base || 1,
        xl: colSpan.xl || colSpan.lg || colSpan.md || colSpan.base || 1
      }}
    >
      {children}
    </GridItem>
  );
};