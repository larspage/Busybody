import {
  Box,
  SimpleGrid,
  HStack,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Text,
  VStack,
  SelectProps,
  InputProps
} from '@chakra-ui/react';
import { useState, useMemo, ChangeEvent } from 'react';
import { Task, TaskStatus, TaskPriority, TaskFilters } from '../../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

type SortField = 'dueDate' | 'priority' | 'status';

const priorityOrder: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2
};

const statusOrder: Record<TaskStatus, number> = {
  todo: 0,
  in_progress: 1,
  completed: 2
};

export const TaskList = ({
  tasks,
  onStatusChange,
  onEdit,
  onDelete
}: TaskListProps) => {
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortBy, setSortBy] = useState<SortField>('dueDate');

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.tags.some(tag => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  }, [filteredTasks, sortBy]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TaskStatus | '';
    setFilters(prev => ({ 
      ...prev, 
      status: value || undefined 
    }));
  };

  const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as TaskPriority | '';
    setFilters(prev => ({ 
      ...prev, 
      priority: value || undefined 
    }));
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as SortField);
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <InputGroup>
          <InputLeftElement>
            <Icon as={() => '🔍'} />
          </InputLeftElement>
          <Input
            placeholder="Search tasks..."
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </InputGroup>
        
        <Select
          value={filters.status || ''}
          onChange={handleStatusChange}
        >
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>

        <Select
          value={filters.priority || ''}
          onChange={handlePriorityChange}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>

        <Select
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="status">Sort by Status</option>
        </Select>
      </HStack>

      {sortedTasks.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">No tasks found</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};