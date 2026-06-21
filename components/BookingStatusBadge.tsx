import { Text, XStack } from 'tamagui';
import type { BookingStatus } from '../types';

interface Props {
  status: BookingStatus;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; color: string }> = {
  pending: { label: 'Pending', bg: '#FFF3CD', color: '#856404' },
  confirmed: { label: 'Confirmed', bg: '#D1E7DD', color: '#0A3622' },
  cancelled: { label: 'Cancelled', bg: '#F8D7DA', color: '#58151C' },
  completed: { label: 'Completed', bg: '#E8F4FD', color: '#0A4E8A' },
};

export function BookingStatusBadge({ status }: Props) {
  const cfg = STATUS_CONFIG[status];
  return (
    <XStack
      style={{ backgroundColor: cfg.bg }}
      px="$2"
      py={4}
      rounded={8}
      self="flex-start"
    >
      <Text fontSize={12} fontWeight="600" style={{ color: cfg.color }}>
        {cfg.label}
      </Text>
    </XStack>
  );
}
