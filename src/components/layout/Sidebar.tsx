import {
  VStack,
  Button,
  Icon,
  Text,
  useColorModeValue,
  Box
} from '@chakra-ui/react';

interface NavItemProps {
  icon: string;
  label: string;
  href?: string;
  isActive?: boolean;
}

const NavItem = ({ icon, label, href = '#', isActive = false }: NavItemProps) => {
  const activeBg = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  return (
    <Button
      as="a"
      href={href}
      variant="ghost"
      justifyContent="flex-start"
      w="full"
      py={3}
      bg={isActive ? activeBg : 'transparent'}
      _hover={{ bg: hoverBg }}
      leftIcon={<Icon as={() => icon} boxSize={5} />}
    >
      <Text>{label}</Text>
    </Button>
  );
};

export const Sidebar = () => {
  return (
    <Box p={4}>
      <VStack spacing={2} align="stretch">
        <NavItem
          icon="📊"
          label="Dashboard"
          isActive={true}
        />
        <NavItem
          icon="✓"
          label="Tasks"
        />
        <NavItem
          icon="📅"
          label="Calendar"
        />
        <NavItem
          icon="📈"
          label="Analytics"
        />
        <NavItem
          icon="⚙️"
          label="Settings"
        />
      </VStack>
    </Box>
  );
};