import {
  Box,
  HStack,
  Text,
  Icon,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { Notification, NotificationType } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const notificationConfig: Record<NotificationType, { icon: string; color: string }> = {
  info: { icon: 'ℹ️', color: 'blue.500' },
  success: { icon: '✅', color: 'green.500' },
  warning: { icon: '⚠️', color: 'orange.500' },
  error: { icon: '❌', color: 'red.500' }
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete
}: NotificationItemProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const config = notificationConfig[notification.type];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      opacity={notification.read ? 0.7 : 1}
      transition="all 0.2s"
      _hover={{ shadow: 'sm' }}
    >
      <HStack spacing={4} align="flex-start">
        <Icon as={() => config.icon} color={config.color} boxSize={5} />
        <Box flex={1}>
          <HStack justify="space-between" mb={1}>
            <Text fontWeight="semibold">{notification.title}</Text>
            <Text fontSize="sm" color="gray.500">
              {formatDate(notification.createdAt)}
            </Text>
          </HStack>
          <Text color="gray.600" mb={2}>
            {notification.message}
          </Text>
          <HStack spacing={2}>
            {notification.actionUrl && (
              <Button
                as="a"
                href={notification.actionUrl}
                size="sm"
                variant="outline"
                colorScheme="brand"
              >
                {notification.actionLabel || 'View'}
              </Button>
            )}
            {!notification.read && onMarkAsRead && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onMarkAsRead(notification.id)}
              >
                Mark as read
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => onDelete(notification.id)}
              >
                Delete
              </Button>
            )}
          </HStack>
        </Box>
      </HStack>
    </Box>
  );
};