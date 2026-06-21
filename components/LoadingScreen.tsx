import { Spinner, Text, YStack } from 'tamagui';

interface Props {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: Props) {
  return (
    <YStack flex={1} items="center" justify="center" gap="$3" bg="$background">
      <Spinner size="large" color="$blue10" />
      <Text color="$colorSubtle" fontSize="$4">{message}</Text>
    </YStack>
  );
}
