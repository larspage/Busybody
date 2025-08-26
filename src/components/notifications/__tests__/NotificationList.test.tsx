import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { NotificationList } from '../NotificationList';
import { Notification } from '../../../types/notification';

describe('NotificationList Component', () => {
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'info',
      title: 'Info Notification',
      message: 'This is an info message',
      createdAt: '2025-01-01T12:00:00Z',
      read: false
    },
    {
      id: '2',
      type: 'success',
      title: 'Success Notification',
      message: 'This is a success message',
      createdAt: '2025-01-01T13:00:00Z',
      read: true
    },
    {
      id: '3',
      type: 'warning',
      title: 'Warning Notification',
      message: 'This is a warning message',
      createdAt: '2025-01-01T14:00:00Z',
      read: false
    }
  ];

  const mockHandlers = {
    onMarkAsRead: jest.fn(),
    onDelete: jest.fn(),
    onMarkAllAsRead: jest.fn(),
    onClearAll: jest.fn()
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ChakraProvider>{ui}</ChakraProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all notifications initially', () => {
    renderWithProviders(
      <NotificationList notifications={mockNotifications} {...mockHandlers} />
    );

    mockNotifications.forEach(notification => {
      expect(screen.getByText(notification.title)).toBeInTheDocument();
      expect(screen.getByText(notification.message)).toBeInTheDocument();
    });
  });

  it('displays correct unread count', () => {
    renderWithProviders(
      <NotificationList notifications={mockNotifications} {...mockHandlers} />
    );

    const unreadCount = mockNotifications.filter(n => !n.read).length;
    expect(screen.getByText(`(${unreadCount} unread)`)).toBeInTheDocument();
  });

  it('filters notifications by type', async () => {
    renderWithProviders(
      <NotificationList notifications={mockNotifications} {...mockHandlers} />
    );

    const typeFilter = screen.getByRole('combobox', { name: /type/i });
    await userEvent.selectOptions(typeFilter, 'success');

    expect(screen.getByText('Success Notification')).toBeInTheDocument();
    expect(screen.queryByText('Info Notification')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning Notification')).not.toBeInTheDocument();
  });

  it('filters notifications by read status', async () => {
    renderWithProviders(
      <NotificationList notifications={mockNotifications} {...mockHandlers} />
    );

    const statusFilter = screen.getByRole('combobox', { name: /status/i });
    await userEvent.selectOptions(statusFilter, 'true'); // read notifications

    expect(screen.getByText('Success Notification')).toBeInTheDocument();
    expect(screen.queryByText('Info Notification')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning Notification')).not.toBeInTheDocument();
  });

  it('filters notifications by search term', async () => {
    renderWithProviders(
      <NotificationList notifications={mockNotifications} {...mockHandlers} />
    );

    const searchInput = screen.getByPlaceholderText(/search notifications/i);
    await userEvent.type(searchInput, 'warning');

    expect(screen.getByText('Warning Notification')).toBeInTheDocument();
    expect(screen.queryByText('Info Notification')).not.toBeInTheDocument();
    expect(screen.queryByText('Success Notification')).not.toBeInTheDocument();
  });

  it('calls onMarkAllAsRead when mark all as read button is clicked', () => {
    renderWithProviders(
      <NotificationList notifications={mockNotifications} {...mockHandlers} />
    );

    const markAllButton = screen.getByRole('button', { name: /mark all as read/i });
    fireEvent.click(markAllButton);

    expect(mockHandlers.onMarkAllAsRead).toHaveBeenCalled();
  });

  it('calls onClearAll when clear all button is clicked', () => {
    renderWithProviders(
      <NotificationList notifications={mockNotifications} {...mockHandlers} />
    );

    const clearAllButton = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearAllButton);

    expect(mockHandlers.onClearAll).toHaveBeenCalled();
  });

  it('displays no notifications message when list is empty', () => {
    renderWithProviders(
      <NotificationList notifications={[]} {...mockHandlers} />
    );

    expect(screen.getByText(/no notifications found/i)).toBeInTheDocument();
  });

  it('propagates individual notification actions', () => {
    renderWithProviders(
      <NotificationList notifications={mockNotifications} {...mockHandlers} />
    );

    const markAsReadButton = screen.getAllByRole('button', { name: /mark as read/i })[0];
    fireEvent.click(markAsReadButton);

    expect(mockHandlers.onMarkAsRead).toHaveBeenCalledWith(mockNotifications[0].id);
  });
});