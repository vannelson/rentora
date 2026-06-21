import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Card, Text, XStack, YStack } from 'tamagui';
import type { Car } from '../../../types';

interface Props {
  car: Car;
}

export function CarCard({ car }: Props) {
  const router = useRouter();
  const thumbnail = car.images[0] ?? 'https://placehold.co/400x220/EEF2FF/6366F1?text=Car';

  return (
    <Card
      elevation={2}
      rounded={16}
      overflow="hidden"
      bg="$background"
      pressStyle={{ scale: 0.98, opacity: 0.92 }}
      onPress={() => router.push(`/cars/${car.id}`)}
      accessibilityLabel={`${car.year} ${car.make} ${car.model}, $${car.price_per_day} per day`}
      accessibilityRole="button"
      mb="$3"
    >
      <Image
        source={{ uri: thumbnail }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        accessibilityLabel={`${car.make} ${car.model} photo`}
      />
      <YStack p="$4" gap="$2">
        <XStack justify="space-between" items="flex-start">
          <YStack flex={1}>
            <Text fontSize="$5" fontWeight="700" color="$color" numberOfLines={1}>
              {car.year} {car.make} {car.model}
            </Text>
            <Text fontSize="$3" color="$colorSubtle" textTransform="capitalize">
              {car.category} · {car.transmission}
            </Text>
          </YStack>
          <YStack items="flex-end">
            <Text fontSize="$5" fontWeight="800" color="$blue10">
              ${car.price_per_day}
            </Text>
            <Text fontSize={11} color="$colorSubtle">per day</Text>
          </YStack>
        </XStack>

        <XStack gap="$3" items="center" mt="$1">
          <XStack gap="$1" items="center">
            <Text fontSize="$3">⭐</Text>
            <Text fontSize="$3" color="$color" fontWeight="600">{car.rating.toFixed(1)}</Text>
            <Text fontSize="$3" color="$colorSubtle">({car.rating_count})</Text>
          </XStack>
          <XStack gap="$1" items="center">
            <Text fontSize="$3">👥</Text>
            <Text fontSize="$3" color="$colorSubtle">{car.seats} seats</Text>
          </XStack>
          <XStack gap="$1" items="center">
            <Text fontSize="$3">⛽</Text>
            <Text fontSize="$3" color="$colorSubtle" textTransform="capitalize">{car.fuel_type}</Text>
          </XStack>
        </XStack>

        <XStack
          bg="$blue10"
          rounded={10}
          py="$2"
          justify="center"
          mt="$2"
          pressStyle={{ opacity: 0.85 }}
          onPress={() => router.push(`/cars/${car.id}`)}
          accessibilityLabel="Book now"
          accessibilityRole="button"
        >
          <Text color="white" fontWeight="700" fontSize="$4">Book Now</Text>
        </XStack>
      </YStack>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: 200 },
});
