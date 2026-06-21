import { Button, Text, YStack } from 'tamagui';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorScreen({ message = 'Something went wrong.', onRetry }: Props) {
  return (
    <YStack flex={1} items="center" justify="center" gap="$4" p="$6" bg="$background">
      <Text fontSize={48}>⚠️</Text>
      <Text color="$color" fontSize="$5" fontWeight="600" text="center">Oops!</Text>
      <Text color="$colorSubtle" fontSize="$4" text="center">{message}</Text>
      {onRetry && (
        <Button onPress={onRetry} theme="blue" rounded={12}>
          Try Again
        </Button>
      )}
    </YStack>
  );
}
