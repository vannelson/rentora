import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Card, Text, XStack, YStack } from 'tamagui';
import { BookingStatusBadge } from '../../../components/BookingStatusBadge';
import type { Booking } from '../../../types';
import { formatDateRange } from '../../../lib/date-utils';

interface Props {
  booking: Booking;
}

export function BookingCard({ booking }: Props) {
  const router = useRouter();
  const car = booking.car;
  const thumbnail = car?.images?.[0] ?? 'https://placehold.co/120x80/EEF2FF/6366F1?text=Car';

  return (
    <Card
      elevation={2}
      rounded={16}
      bg="$background"
      mb="$3"
      pressStyle={{ scale: 0.98, opacity: 0.92 }}
      onPress={() => router.push(`/bookings/${booking.id}`)}
      accessibilityLabel={`Booking for ${car?.make} ${car?.model}`}
      accessibilityRole="button"
    >
      <XStack p="$4" gap="$3" items="center">
        <Image source={{ uri: thumbnail }} style={[styles.thumbnail, { borderRadius: 10 }]} contentFit="cover" />
        <YStack flex={1} gap="$1">
          <Text fontSize="$4" fontWeight="700" numberOfLines={1}>
            {car ? `${car.year} ${car.make} ${car.model}` : 'Car details unavailable'}
          </Text>
          <Text fontSize="$3" color="$colorSubtle">
            {formatDateRange(booking.start_date, booking.end_date)}
          </Text>
          <XStack justify="space-between" items="center" mt="$1">
            <BookingStatusBadge status={booking.status} />
            <Text fontSize="$4" fontWeight="700" color="$blue10">
              ${booking.total_price}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  thumbnail: { width: 90, height: 70 },
});
