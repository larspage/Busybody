import {
  VStack,
  Button,
  Select,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  useColorModeValue
} from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { taskSchema, type TaskFormData, defaultTaskFormValues } from '../../schemas/task.schema';
import { FormField } from '../form/FormField';
import { Task } from '../../types/task';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
}

export function TaskForm({ task, onSubmit, isLoading }: TaskFormProps) {
  const [newTag, setNewTag] = useState('');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      ...task,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0]
    } : defaultTaskFormValues
  });

  const { handleSubmit, register, watch, setValue } = methods;
  const tags = watch('tags');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setValue('tags', [...tags, newTag.trim()]);
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <FormField
            name="title"
            label="Title"
            placeholder="Enter task title"
          />

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...register('description')}
              placeholder="Enter task description"
              rows={4}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Priority</FormLabel>
            <Select {...register('priority')}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select {...register('status')}>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </FormControl>

          <FormField
            name="dueDate"
            label="Due Date"
            type="date"
          />

          <FormControl>
            <FormLabel>Tags</FormLabel>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type and press Enter to add tags"
              mb={2}
            />
            <HStack spacing={2} wrap="wrap">
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                </Tag>
              ))}
            </HStack>
          </FormControl>

          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isLoading}
            width="full"
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </VStack>
      </form>
    </FormProvider>
  );
}