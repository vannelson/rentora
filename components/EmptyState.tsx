import type { ReactNode } from 'react';
import { Button, Text, YStack } from 'tamagui';

interface Props {
  icon?: ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <YStack flex={1} items="center" justify="center" gap="$3" p="$6">
      {icon}
      <Text color="$color" fontSize="$5" fontWeight="700" text="center">{title}</Text>
      {message && (
        <Text color="$colorSubtle" fontSize="$4" text="center" lineHeight={22}>{message}</Text>
      )}
      {actionLabel && onAction && (
        <Button onPress={onAction} theme="blue" mt="$2" rounded={12}>
          {actionLabel}
        </Button>
      )}
    </YStack>
  );
}
