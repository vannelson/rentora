import { Button, Text, XStack } from 'tamagui';

interface Props {
  mode: 'login' | 'signup';
}

export function SocialLoginButtons({ mode }: Props) {
  const label = mode === 'login' ? 'Log in' : 'Sign up';
  return (
    <XStack gap="$3" width="100%">
      <Button
        flex={1}
        rounded={12}
        borderWidth={1}
        borderColor="$borderColor"
        bg="$background"
        accessibilityLabel={`${label} with Google`}
        accessibilityRole="button"
        pressStyle={{ opacity: 0.7 }}
      >
        <Text fontSize="$4" fontWeight="600">G  Google</Text>
      </Button>
      <Button
        flex={1}
        rounded={12}
        borderWidth={1}
        borderColor="$borderColor"
        bg="$background"
        accessibilityLabel={`${label} with Apple`}
        accessibilityRole="button"
        pressStyle={{ opacity: 0.7 }}
      >
        <Text fontSize="$4" fontWeight="600"> Apple</Text>
      </Button>
    </XStack>
  );
}
