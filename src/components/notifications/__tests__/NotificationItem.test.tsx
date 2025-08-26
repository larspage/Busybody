import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { NotificationItem } from '../NotificationItem';
import { Notification } from '../../../types/notification';

describe('NotificationItem Component', () => {
  const mockNotification: Notification = {
    id: '1',
    type: 'info',
    title: 'Test Notification',
    message: 'This is a test notification',
    createdAt: '2025-01-01T12:00:00Z',
    read: false,
    actionUrl: '/test',
    actionLabel: 'View Details'
  };

  const mockHandlers = {
    onMarkAsRead: jest.fn(),
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

  it('renders notification content correctly', () => {
    renderWithProviders(
      <NotificationItem notification={mockNotification} {...mockHandlers} />
    );

    expect(screen.getByText(mockNotification.title)).toBeInTheDocument();
    expect(screen.getByText(mockNotification.message)).toBeInTheDocument();
    expect(screen.getByText(mockNotification.actionLabel!)).toBeInTheDocument();
  });

  it('displays correct icon based on notification type', () => {
    const types: Array<'info' | 'success' | 'warning' | 'error'> = ['info', 'success', 'warning', 'error'];
    
    types.forEach(type => {
      const notification = { ...mockNotification, type };
      const { container, unmount } = renderWithProviders(
        <NotificationItem notification={notification} {...mockHandlers} />
      );

      const icon = container.querySelector(`[data-testid="notification-icon-${type}"]`);
      expect(icon).toBeInTheDocument();
      unmount();
    });
  });

  it('calls onMarkAsRead when mark as read button is clicked', () => {
    renderWithProviders(
      <NotificationItem notification={mockNotification} {...mockHandlers} />
    );

    const markAsReadButton = screen.getByRole('button', { name: /mark as read/i });
    fireEvent.click(markAsReadButton);

    expect(mockHandlers.onMarkAsRead).toHaveBeenCalledWith(mockNotification.id);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderWithProviders(
      <NotificationItem notification={mockNotification} {...mockHandlers} />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockNotification.id);
  });

  it('renders action link with correct URL', () => {
    renderWithProviders(
      <NotificationItem notification={mockNotification} {...mockHandlers} />
    );

    const actionLink = screen.getByRole('link', { name: mockNotification.actionLabel! });
    expect(actionLink).toHaveAttribute('href', mockNotification.actionUrl);
  });

  it('applies different styles for read notifications', () => {
    const readNotification = { ...mockNotification, read: true };
    const { container } = renderWithProviders(
      <NotificationItem notification={readNotification} {...mockHandlers} />
    );

    const notificationElement = container.firstChild;
    expect(notificationElement).toHaveStyle({ opacity: '0.7' });
  });

  it('formats timestamp correctly', () => {
    renderWithProviders(
      <NotificationItem notification={mockNotification} {...mockHandlers} />
    );

    const formattedDate = new Date(mockNotification.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('does not show mark as read button for read notifications', () => {
    const readNotification = { ...mockNotification, read: true };
    renderWithProviders(
      <NotificationItem notification={readNotification} {...mockHandlers} />
    );

    const markAsReadButton = screen.queryByRole('button', { name: /mark as read/i });
    expect(markAsReadButton).not.toBeInTheDocument();
  });
});