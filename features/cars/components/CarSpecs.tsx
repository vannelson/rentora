import { Text, XStack, YStack } from 'tamagui';
import type { Car } from '../../../types';

interface Props {
  car: Car;
}

interface SpecItemProps {
  icon: string;
  label: string;
  value: string;
}

function SpecItem({ icon, label, value }: SpecItemProps) {
  return (
    <YStack
      flex={1}
      items="center"
      gap="$1"
      bg="$backgroundHover"
      rounded={12}
      p="$3"
    >
      <Text fontSize={22}>{icon}</Text>
      <Text fontSize="$4" fontWeight="700" color="$color">{value}</Text>
      <Text fontSize={11} color="$colorSubtle">{label}</Text>
    </YStack>
  );
}

export function CarSpecs({ car }: Props) {
  return (
    <YStack gap="$3">
      <Text fontSize="$5" fontWeight="700" color="$color">Specifications</Text>
      <XStack gap="$2">
        <SpecItem icon="👥" label="Seats" value={String(car.seats)} />
        <SpecItem icon="⚙️" label="Transmission" value={car.transmission === 'automatic' ? 'Auto' : 'Manual'} />
        <SpecItem icon="⛽" label="Fuel" value={car.fuel_type.charAt(0).toUpperCase() + car.fuel_type.slice(1)} />
        <SpecItem icon="🛣️" label="Mileage" value={`${car.mileage_limit} km`} />
      </XStack>
    </YStack>
  );
}
