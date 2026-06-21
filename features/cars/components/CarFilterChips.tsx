import { ScrollView } from 'react-native';
import { Text, XStack } from 'tamagui';
import { useFilterStore } from '../../../stores/filter.store';
import type { CarCategory, TransmissionType } from '../../../types';

const CATEGORIES: { label: string; value: CarCategory }[] = [
  { label: 'Economy', value: 'economy' },
  { label: 'Sedan', value: 'sedan' },
  { label: 'SUV', value: 'suv' },
  { label: 'Luxury', value: 'luxury' },
  { label: 'Van', value: 'van' },
  { label: 'Sports', value: 'sports' },
];

const TRANSMISSIONS: { label: string; value: TransmissionType }[] = [
  { label: 'Automatic', value: 'automatic' },
  { label: 'Manual', value: 'manual' },
];

const SEATS = [2, 4, 5, 7, 8];

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <XStack
      bg={active ? '$blue10' : '$background'}
      borderWidth={1}
      borderColor={active ? '$blue10' : '$borderColor'}
      rounded={20}
      px="$3"
      py={8}
      mr="$2"
      pressStyle={{ opacity: 0.75 }}
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text
        fontSize="$3"
        fontWeight="600"
        color={active ? 'white' : '$color'}
      >
        {label}
      </Text>
    </XStack>
  );
}

export function CarFilterChips() {
  const { filters, setFilters } = useFilterStore();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
      <XStack px="$4" py="$2">
        {CATEGORIES.map((c) => (
          <Chip
            key={c.value}
            label={c.label}
            active={filters.category === c.value}
            onPress={() =>
              setFilters({ category: filters.category === c.value ? undefined : c.value })
            }
          />
        ))}
        {TRANSMISSIONS.map((t) => (
          <Chip
            key={t.value}
            label={t.label}
            active={filters.transmission === t.value}
            onPress={() =>
              setFilters({
                transmission: filters.transmission === t.value ? undefined : t.value,
              })
            }
          />
        ))}
        {SEATS.map((s) => (
          <Chip
            key={s}
            label={`${s}+ seats`}
            active={filters.seats === s}
            onPress={() => setFilters({ seats: filters.seats === s ? undefined : s })}
          />
        ))}
      </XStack>
    </ScrollView>
  );
}
