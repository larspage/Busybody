import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon?: string;
  change?: number;
  changeLabel?: string;
  colorScheme?: string;
}

export const AnalyticsCard = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  colorScheme = 'blue'
}: AnalyticsCardProps) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const iconColor = `${colorScheme}.500`;

  const getChangeColor = (changeValue: number) => {
    return changeValue >= 0 ? 'green.500' : 'red.500';
  };

  return (
    <Box
      p={6}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      shadow="sm"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
    >
      <HStack spacing={4} align="flex-start">
        {icon && (
          <Icon
            as={() => icon}
            boxSize={8}
            color={iconColor}
          />
        )}
        <Stat>
          <StatLabel fontSize="sm" color="gray.500">
            {title}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold">
            {value}
          </StatNumber>
          {(change !== undefined || changeLabel) && (
            <StatHelpText
              color={change !== undefined ? getChangeColor(change) : undefined}
              mb={0}
            >
              {change !== undefined && (
                <>
                  <StatArrow
                    type={change >= 0 ? 'increase' : 'decrease'}
                  />
                  {Math.abs(change)}%
                </>
              )}
              {changeLabel && (
                <Box as="span" color="gray.500" ml={change !== undefined ? 2 : 0}>
                  {changeLabel}
                </Box>
              )}
            </StatHelpText>
          )}
        </Stat>
      </HStack>
    </Box>
  );
};