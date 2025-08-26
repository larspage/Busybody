import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { AnalyticsChart, ChartType } from '../AnalyticsChart';

describe('AnalyticsChart Component', () => {
  const mockSeries = [
    {
      name: 'Revenue',
      data: [
        { label: 'Jan', value: 1000, tooltip: '$1,000' },
        { label: 'Feb', value: 1500, tooltip: '$1,500' },
        { label: 'Mar', value: 1200, tooltip: '$1,200' }
      ],
      color: 'blue.500'
    },
    {
      name: 'Users',
      data: [
        { label: 'Jan', value: 100, tooltip: '100 users' },
        { label: 'Feb', value: 150, tooltip: '150 users' },
        { label: 'Mar', value: 120, tooltip: '120 users' }
      ],
      color: 'green.500'
    }
  ];

  const mockProps = {
    title: 'Analytics Overview',
    description: 'Monthly metrics',
    type: 'line' as ChartType,
    series: mockSeries,
    height: 400,
    showLegend: true,
    allowTypeChange: true,
    timeRange: 'month' as const,
    onTimeRangeChange: jest.fn()
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <ChakraProvider>{ui}</ChakraProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders chart title and description', () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} />
    );

    expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    expect(screen.getByText(mockProps.description)).toBeInTheDocument();
  });

  it('renders legend with series names', () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} />
    );

    mockSeries.forEach(series => {
      expect(screen.getByText(series.name)).toBeInTheDocument();
    });
  });

  it('hides legend when showLegend is false', () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} showLegend={false} />
    );

    mockSeries.forEach(series => {
      expect(screen.queryByText(series.name)).not.toBeInTheDocument();
    });
  });

  it('allows chart type change when enabled', async () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} />
    );

    const typeSelect = screen.getByRole('combobox', { name: /chart type/i });
    expect(typeSelect).toBeInTheDocument();

    await userEvent.selectOptions(typeSelect, 'bar');
    expect(typeSelect).toHaveValue('bar');
  });

  it('hides chart type selector when allowTypeChange is false', () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} allowTypeChange={false} />
    );

    expect(screen.queryByRole('combobox', { name: /chart type/i })).not.toBeInTheDocument();
  });

  it('calls onTimeRangeChange when time range is changed', async () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} />
    );

    const timeRangeSelect = screen.getByRole('combobox', { name: /time range/i });
    await userEvent.selectOptions(timeRangeSelect, 'week');

    expect(mockProps.onTimeRangeChange).toHaveBeenCalledWith('week');
  });

  it('renders download button with tooltip', () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} />
    );

    const downloadButton = screen.getByRole('button', { name: /download chart data/i });
    expect(downloadButton).toBeInTheDocument();

    fireEvent.mouseOver(downloadButton);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('applies custom height to chart container', () => {
    const { container } = renderWithProviders(
      <AnalyticsChart {...mockProps} />
    );

    const chartContainer = container.querySelector('[data-testid="chart-container"]');
    expect(chartContainer).toHaveStyle({ height: `${mockProps.height}px` });
  });

  it('displays placeholder when no data is provided', () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} series={[]} />
    );

    expect(screen.getByText(/chart will be implemented/i)).toBeInTheDocument();
  });

  it('renders series colors in legend', () => {
    renderWithProviders(
      <AnalyticsChart {...mockProps} />
    );

    mockSeries.forEach(series => {
      const colorIndicator = screen.getByTestId(`legend-color-${series.name}`);
      expect(colorIndicator).toHaveStyle({ backgroundColor: series.color });
    });
  });
});