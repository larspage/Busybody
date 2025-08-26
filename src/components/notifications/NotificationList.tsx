import {
  VStack,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Text,
  Box,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { useState } from 'react';
import { Notification, NotificationType, NotificationFilters } from '../../types/notification';
import { NotificationItem } from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

export const NotificationList = ({
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onClearAll
}: NotificationListProps) => {
  const [filters, setFilters] = useState<NotificationFilters>({});
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const filteredNotifications = notifications.filter(notification => {
    if (filters.type && notification.type !== filters.type) return false;
    if (filters.read !== undefined && notification.read !== filters.read) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <VStack spacing={4} align="stretch">
      <HStack justify="space-between" pb={2} borderBottom="1px" borderColor={borderColor}>
        <Text fontSize="lg" fontWeight="semibold">
          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
        </Text>
        <HStack spacing={2}>
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button size="sm" variant="outline" onClick={onMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && onClearAll && (
            <Button size="sm" variant="ghost" colorScheme="red" onClick={onClearAll}>
              Clear all
            </Button>
          )}
        </HStack>
      </HStack>

      <HStack spacing={4}>
        <InputGroup>
          <InputLeftElement>
            <Icon as={() => '🔍'} />
          </InputLeftElement>
          <Input
            placeholder="Search notifications..."
            value={filters.search || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </InputGroup>

        <Select
          value={filters.type || ''}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            type: e.target.value as NotificationType || undefined 
          }))}
        >
          <option value="">All Types</option>
          <option value="info">Info</option>
          <option value="success">Success</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </Select>

        <Select
          value={filters.read === undefined ? '' : filters.read.toString()}
          onChange={(e) => setFilters(prev => ({ 
            ...prev, 
            read: e.target.value === '' ? undefined : e.target.value === 'true'
          }))}
        >
          <option value="">All Status</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </Select>
      </HStack>

      {filteredNotifications.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">No notifications found</Text>
        </Box>
      ) : (
        <VStack spacing={2} align="stretch">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};