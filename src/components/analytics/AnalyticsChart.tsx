import {
  Box,
  useColorModeValue,
  Text,
  HStack,
  Select,
  Tooltip,
  Icon
} from '@chakra-ui/react';

export type ChartType = 'line' | 'bar' | 'area' | 'pie';

export interface DataPoint {
  label: string;
  value: number;
  tooltip?: string;
}

export interface ChartSeries {
  name: string;
  data: DataPoint[];
  color?: string;
}

interface AnalyticsChartProps {
  title: string;
  description?: string;
  type?: ChartType;
  series: ChartSeries[];
  height?: number;
  showLegend?: boolean;
  allowTypeChange?: boolean;
  timeRange?: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange?: (range: string) => void;
}

export const AnalyticsChart = ({
  title,
  description,
  type = 'line',
  series,
  height = 300,
  showLegend = true,
  allowTypeChange = false,
  timeRange,
  onTimeRangeChange
}: AnalyticsChartProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Placeholder for actual chart implementation
  const renderChart = () => {
    return (
      <Box
        height={`${height}px`}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color={textColor}>
          Chart will be implemented with a charting library (e.g., Recharts, Chart.js)
        </Text>
      </Box>
    );
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="sm"
    >
      <HStack justify="space-between" mb={4}>
        <Box>
          <Text fontSize="lg" fontWeight="semibold">
            {title}
          </Text>
          {description && (
            <Text fontSize="sm" color={textColor}>
              {description}
            </Text>
          )}
        </Box>

        <HStack spacing={2}>
          {timeRange && onTimeRangeChange && (
            <Select
              size="sm"
              value={timeRange}
              onChange={(e) => onTimeRangeChange(e.target.value)}
            >
              <option value="day">Last 24 hours</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last 12 months</option>
            </Select>
          )}

          {allowTypeChange && (
            <Select
              size="sm"
              value={type}
              onChange={(e) => console.log('Chart type changed:', e.target.value)}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="area">Area Chart</option>
              <option value="pie">Pie Chart</option>
            </Select>
          )}

          <Tooltip label="Download chart data">
            <Icon
              as={() => '📥'}
              cursor="pointer"
              onClick={() => console.log('Download chart data')}
            />
          </Tooltip>
        </HStack>
      </HStack>

      {renderChart()}

      {showLegend && series.length > 0 && (
        <HStack spacing={4} mt={4} flexWrap="wrap">
          {series.map((s, index) => (
            <HStack key={index} spacing={2}>
              <Box
                w={3}
                h={3}
                borderRadius="full"
                bg={s.color || `blue.${(index + 5) * 100}`}
              />
              <Text fontSize="sm">{s.name}</Text>
            </HStack>
          ))}
        </HStack>
      )}
    </Box>
  );
};