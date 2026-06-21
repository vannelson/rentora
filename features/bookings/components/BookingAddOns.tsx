import { Text, XStack, YStack } from 'tamagui';
import { useBookingStore } from '../../../stores/booking.store';

const ADD_ONS = [
  { id: 'insurance', name: 'Full Insurance', icon: '🛡️', price: 15 },
  { id: 'child_seat', name: 'Child Seat', icon: '👶', price: 8 },
  { id: 'gps', name: 'GPS Navigator', icon: '🗺️', price: 5 },
  { id: 'wifi', name: 'Mobile Wi-Fi', icon: '📶', price: 7 },
];

export function BookingAddOns() {
  const { draft, toggleAddOn } = useBookingStore();

  return (
    <YStack gap="$3">
      <Text fontSize="$5" fontWeight="700">Optional Add-ons</Text>
      {ADD_ONS.map((item) => {
        const active = draft.addOns.includes(item.id);
        return (
          <XStack
            key={item.id}
            items="center"
            p="$3"
            rounded={12}
            borderWidth={1.5}
            borderColor={active ? '$blue8' : '$borderColor'}
            bg={active ? '$blue2' : '$background'}
            pressStyle={{ opacity: 0.8 }}
            onPress={() => toggleAddOn(item.id)}
            accessibilityLabel={`${item.name}, $${item.price} per day`}
            accessibilityRole="checkbox"
          >
            <Text fontSize={24} mr="$3">{item.icon}</Text>
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="600" color="$color">{item.name}</Text>
              <Text fontSize="$3" color="$colorSubtle">+${item.price}/day</Text>
            </YStack>
            <XStack
              width={22}
              height={22}
              rounded={11}
              borderWidth={2}
              borderColor={active ? '$blue10' : '$borderColor'}
              bg={active ? '$blue10' : 'transparent'}
              items="center"
              justify="center"
            >
              {active && <Text color="white" fontSize={12} fontWeight="700">✓</Text>}
            </XStack>
          </XStack>
        );
      })}
    </YStack>
  );
}

export const ADD_ON_PRICES: Record<string, number> = Object.fromEntries(
  ADD_ONS.map((a) => [a.id, a.price])
);
