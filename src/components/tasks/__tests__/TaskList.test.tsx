import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { TaskList } from '../TaskList';
import { Task } from '../../../types/task';

describe('TaskList Component', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'High Priority Task',
      description: 'Urgent task',
      priority: 'high',
      status: 'todo',
      dueDate: '2025-12-31',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      tags: ['urgent', 'important']
    },
    {
      id: '2',
      title: 'In Progress Task',
      description: 'Working on it',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2025-11-30',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      tags: ['development']
    },
    {
      id: '3',
      title: 'Completed Task',
      description: 'Done',
      priority: 'low',
      status: 'completed',
      dueDate: '2025-10-31',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
      tags: ['done']
    }
  ];

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

  it('renders all tasks initially', () => {
    renderWithProviders(
      <TaskList tasks={mockTasks} {...mockHandlers} />
    );

    mockTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it('filters tasks by status', async () => {
    renderWithProviders(
      <TaskList tasks={mockTasks} {...mockHandlers} />
    );

    const statusFilter = screen.getByRole('combobox', { name: /status/i });
    await userEvent.selectOptions(statusFilter, 'in_progress');

    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
    expect(screen.queryByText('High Priority Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });

  it('filters tasks by priority', async () => {
    renderWithProviders(
      <TaskList tasks={mockTasks} {...mockHandlers} />
    );

    const priorityFilter = screen.getByRole('combobox', { name: /priority/i });
    await userEvent.selectOptions(priorityFilter, 'high');

    expect(screen.getByText('High Priority Task')).toBeInTheDocument();
    expect(screen.queryByText('In Progress Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });

  it('filters tasks by search term', async () => {
    renderWithProviders(
      <TaskList tasks={mockTasks} {...mockHandlers} />
    );

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await userEvent.type(searchInput, 'urgent');

    expect(screen.getByText('High Priority Task')).toBeInTheDocument();
    expect(screen.queryByText('In Progress Task')).not.toBeInTheDocument();
    expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
  });

  it('sorts tasks by due date', async () => {
    renderWithProviders(
      <TaskList tasks={mockTasks} {...mockHandlers} />
    );

    const sortSelect = screen.getByRole('combobox', { name: /sort/i });
    await userEvent.selectOptions(sortSelect, 'dueDate');

    const taskElements = screen.getAllByRole('article');
    expect(taskElements[0]).toHaveTextContent('Completed Task');
    expect(taskElements[2]).toHaveTextContent('High Priority Task');
  });

  it('displays no tasks message when filtered results are empty', async () => {
    renderWithProviders(
      <TaskList tasks={mockTasks} {...mockHandlers} />
    );

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await userEvent.type(searchInput, 'nonexistent task');

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it('propagates task actions to parent handlers', () => {
    renderWithProviders(
      <TaskList tasks={mockTasks} {...mockHandlers} />
    );

    const firstTask = screen.getByText('High Priority Task').closest('article');
    const editButton = within(firstTask!).getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockHandlers.onEdit).toHaveBeenCalledWith('1');
  });
});