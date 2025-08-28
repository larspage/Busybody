import {
  Box,
  useColorModeValue,
  Text,
  HStack,
  Select,
  Tooltip,
  Icon
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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
  onTypeChange?: (type: ChartType) => void;
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
  onTimeRangeChange,
  onTypeChange
}: AnalyticsChartProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  // Default colors for chart series
  const defaultColors = [
    '#3182CE', // blue.500
    '#38A169', // green.500
    '#D69E2E', // yellow.500
    '#E53E3E', // red.500
    '#805AD5', // purple.500
    '#DD6B20', // orange.500
    '#319795', // teal.500
    '#D53F8C'  // pink.500
  ];

  // Transform series data for Recharts
  const chartData = series[0]?.data.map((point, index) => {
    const dataPoint: any = { label: point.label };
    series.forEach((s, seriesIndex) => {
      dataPoint[s.name] = s.data[index]?.value || 0;
    });
    return dataPoint;
  }) || [];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg={useColorModeValue('white', 'gray.700')}
          border="1px solid"
          borderColor={useColorModeValue('gray.200', 'gray.600')}
          borderRadius="md"
          p={3}
          shadow="md"
        >
          <Text fontWeight="semibold" mb={2}>{label}</Text>
          {payload.map((entry: any, index: number) => (
            <HStack key={index} spacing={2} justify="space-between" minW="120px">
              <HStack spacing={1}>
                <Box w={3} h={3} borderRadius="full" bg={entry.color} />
                <Text fontSize="sm">{entry.dataKey}:</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="semibold">{entry.value}</Text>
            </HStack>
          ))}
        </Box>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!chartData.length) {
      return (
        <Box
          height={`${height}px`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color={textColor}>No data available</Text>
        </Box>
      );
    }

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('#E2E8F0', '#4A5568')} />
              <XAxis
                dataKey="label"
                stroke={textColor}
                fontSize={12}
              />
              <YAxis stroke={textColor} fontSize={12} />
              <RechartsTooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              {series.map((s, index) => (
                <Line
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={s.color || defaultColors[index % defaultColors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('#E2E8F0', '#4A5568')} />
              <XAxis
                dataKey="label"
                stroke={textColor}
                fontSize={12}
              />
              <YAxis stroke={textColor} fontSize={12} />
              <RechartsTooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              {series.map((s, index) => (
                <Bar
                  key={s.name}
                  dataKey={s.name}
                  fill={s.color || defaultColors[index % defaultColors.length]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke={useColorModeValue('#E2E8F0', '#4A5568')} />
              <XAxis
                dataKey="label"
                stroke={textColor}
                fontSize={12}
              />
              <YAxis stroke={textColor} fontSize={12} />
              <RechartsTooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              {series.map((s, index) => (
                <Area
                  key={s.name}
                  type="monotone"
                  dataKey={s.name}
                  stroke={s.color || defaultColors[index % defaultColors.length]}
                  fill={s.color || defaultColors[index % defaultColors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        // For pie chart, use the first series data
        const pieData = series[0]?.data.map((point, index) => ({
          name: point.label,
          value: point.value,
          fill: defaultColors[index % defaultColors.length]
        })) || [];

        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <Box
            height={`${height}px`}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text color={textColor}>Unsupported chart type</Text>
          </Box>
        );
    }
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
              onChange={(e) => onTypeChange?.(e.target.value as ChartType)}
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