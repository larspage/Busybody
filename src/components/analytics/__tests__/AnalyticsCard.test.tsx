import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { AnalyticsCard } from '../AnalyticsCard';

describe('AnalyticsCard Component', () => {
  const mockProps = {
    title: 'Total Users',
    value: '1,234',
    icon: '👥',
    change: 12.5,
    changeLabel: 'vs last month',
    colorScheme: 'blue'
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ChakraProvider>{ui}</ChakraProvider>
    );
  };

  it('renders basic card information', () => {
    renderWithProviders(
      <AnalyticsCard
        title={mockProps.title}
        value={mockProps.value}
      />
    );

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.value)).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = renderWithProviders(
      <AnalyticsCard
        title={mockProps.title}
        value={mockProps.value}
        icon={mockProps.icon}
      />
    );

    const icon = container.querySelector('[data-testid="analytics-icon"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveTextContent(mockProps.icon);
  });

  it('displays positive change with up arrow', () => {
    renderWithProviders(
      <AnalyticsCard
        title={mockProps.title}
        value={mockProps.value}
        change={mockProps.change}
      />
    );

    const changeElement = screen.getByText(`${mockProps.change}%`);
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveStyle({ color: 'green.500' });
    expect(screen.getByTestId('change-arrow-up')).toBeInTheDocument();
  });

  it('displays negative change with down arrow', () => {
    renderWithProviders(
      <AnalyticsCard
        title={mockProps.title}
        value={mockProps.value}
        change={-mockProps.change}
      />
    );

    const changeElement = screen.getByText(`${mockProps.change}%`);
    expect(changeElement).toBeInTheDocument();
    expect(changeElement).toHaveStyle({ color: 'red.500' });
    expect(screen.getByTestId('change-arrow-down')).toBeInTheDocument();
  });

  it('renders change label when provided', () => {
    renderWithProviders(
      <AnalyticsCard
        title={mockProps.title}
        value={mockProps.value}
        changeLabel={mockProps.changeLabel}
      />
    );

    expect(screen.getByText(mockProps.changeLabel)).toBeInTheDocument();
  });

  it('applies custom color scheme', () => {
    const { container } = renderWithProviders(
      <AnalyticsCard
        title={mockProps.title}
        value={mockProps.value}
        icon={mockProps.icon}
        colorScheme={mockProps.colorScheme}
      />
    );

    const icon = container.querySelector('[data-testid="analytics-icon"]');
    expect(icon).toHaveStyle({ color: `${mockProps.colorScheme}.500` });
  });

  it('handles undefined change and changeLabel', () => {
    renderWithProviders(
      <AnalyticsCard
        title={mockProps.title}
        value={mockProps.value}
      />
    );

    expect(screen.queryByTestId('change-arrow-up')).not.toBeInTheDocument();
    expect(screen.queryByTestId('change-arrow-down')).not.toBeInTheDocument();
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('uses default color scheme when not provided', () => {
    const { container } = renderWithProviders(
      <AnalyticsCard
        title={mockProps.title}
        value={mockProps.value}
        icon={mockProps.icon}
      />
    );

    const icon = container.querySelector('[data-testid="analytics-icon"]');
    expect(icon).toHaveStyle({ color: 'blue.500' });
  });
});