import { ReactNode } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
  HStack,
  Icon
} from '@chakra-ui/react';
import { useStore } from '../../store';

interface NavItemProps {
  children: ReactNode;
  href?: string;
}

const NavItem = ({ children, href = '#' }: NavItemProps) => (
  <Button
    as="a"
    href={href}
    variant="ghost"
    size="sm"
    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
  >
    {children}
  </Button>
);

export const Header = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="nav"
      bg={bgColor}
      borderBottom="1px"
      borderBottomColor={borderColor}
      px={4}
      py={2}
    >
      <Flex align="center" justify="space-between">
        {/* Logo/Brand */}
        <Text fontSize="xl" fontWeight="bold">
          Busybody
        </Text>

        {/* Navigation Links */}
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          <NavItem>Dashboard</NavItem>
          <NavItem>Tasks</NavItem>
          <NavItem>Calendar</NavItem>
        </HStack>

        {/* Right Section - User Menu */}
        <HStack spacing={2}>
          <IconButton
            aria-label="Notifications"
            icon={<Icon as={() => '🔔'} />}
            variant="ghost"
            size="sm"
          />
          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
              rightIcon={<Icon as={() => '👤'} />}
            >
              Profile
            </MenuButton>
            <MenuList>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Account</MenuItem>
              <MenuItem color="red.500">Sign Out</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};