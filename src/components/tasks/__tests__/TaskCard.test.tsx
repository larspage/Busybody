import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { TaskCard } from '../TaskCard';
import { Task } from '../../../types/task';

describe('TaskCard Component', () => {
  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    priority: 'medium',
    status: 'todo',
    dueDate: '2025-12-31',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    tags: ['test', 'demo']
  };

  const mockHandlers = {
    onStatusChange: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ChakraProvider>{ui}</ChakraProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders task details correctly', () => {
    renderWithProviders(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/todo/i)).toBeInTheDocument();
    mockTask.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it('calls onEdit when edit button is clicked', () => {
    renderWithProviders(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask.id);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithProviders(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('displays priority with correct color', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as const };
    renderWithProviders(
      <TaskCard task={highPriorityTask} {...mockHandlers} />
    );

    const priorityBadge = screen.getByText(/high/i);
    expect(priorityBadge).toHaveStyle({ backgroundColor: expect.stringContaining('red') });
  });

  it('formats due date correctly', () => {
    renderWithProviders(
      <TaskCard task={mockTask} {...mockHandlers} />
    );

    const formattedDate = new Date(mockTask.dueDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    expect(screen.getByText(new RegExp(formattedDate))).toBeInTheDocument();
  });
});