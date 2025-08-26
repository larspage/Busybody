import {
  Box,
  Badge,
  Text,
  HStack,
  VStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue
} from '@chakra-ui/react';
import { Task, TaskStatus } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const statusColors = {
  todo: 'gray',
  in_progress: 'blue',
  completed: 'green'
};

const priorityColors = {
  low: 'green',
  medium: 'yellow',
  high: 'red'
};

export const TaskCard = ({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
      p={4}
      shadow="sm"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="semibold">
            {task.title}
          </Text>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<>⋮</>}
              variant="ghost"
              size="sm"
            />
            <MenuList>
              <MenuItem onClick={() => onEdit?.(task.id)}>Edit</MenuItem>
              <MenuItem onClick={() => onDelete?.(task.id)} color="red.500">
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <Text noOfLines={2} color="gray.600">
          {task.description}
        </Text>

        <HStack spacing={2}>
          <Badge colorScheme={statusColors[task.status]}>
            {task.status.replace('_', ' ')}
          </Badge>
          <Badge colorScheme={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
          {task.dueDate && (
            <Badge colorScheme="purple">
              Due {formatDate(task.dueDate)}
            </Badge>
          )}
        </HStack>

        {task.tags.length > 0 && (
          <HStack spacing={2}>
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </HStack>
        )}
      </VStack>
    </Box>
  );
};