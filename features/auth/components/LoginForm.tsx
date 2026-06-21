import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, Spinner, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../hooks/useAuth';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas';
import { SocialLoginButtons } from './SocialLoginButtons';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: standardSchemaResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setApiError('');
    try {
      await login(values.email, values.password);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : 'Invalid credentials. Please try again.');
    }
  }

  return (
    <YStack gap="$4" width="100%">
      <YStack gap="$2">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Email address"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              rounded={12}
              borderColor={errors.email ? '$red8' : '$borderColor'}
              height={52}
              px="$4"
              fontSize="$4"
              accessibilityLabel="Email address"
            />
          )}
        />
        {errors.email && <Text color="$red10" fontSize={13}>{errors.email.message}</Text>}
      </YStack>

      <YStack gap="$2">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Password"
              secureTextEntry
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              rounded={12}
              borderColor={errors.password ? '$red8' : '$borderColor'}
              height={52}
              px="$4"
              fontSize="$4"
              accessibilityLabel="Password"
            />
          )}
        />
        {errors.password && <Text color="$red10" fontSize={13}>{errors.password.message}</Text>}
      </YStack>

      <Button
        self="flex-end"
        chromeless
        onPress={() => router.push('/(auth)/forgot-password')}
        accessibilityRole="button"
      >
        <Text color="$blue10" fontSize="$3">Forgot password?</Text>
      </Button>

      {apiError ? (
        <XStack
          bg="$red2"
          rounded={10}
          p="$3"
          borderWidth={1}
          borderColor="$red6"
        >
          <Text color="$red10" fontSize="$3">{apiError}</Text>
        </XStack>
      ) : null}

      <Button
        onPress={handleSubmit(onSubmit)}
        theme="blue"
        rounded={14}
        height={52}
        disabled={isSubmitting}
        pressStyle={{ opacity: 0.85 }}
        accessibilityLabel="Log in"
        accessibilityRole="button"
      >
        {isSubmitting ? <Spinner color="white" /> : <Text color="white" fontWeight="700" fontSize="$5">Log In</Text>}
      </Button>

      <XStack items="center" gap="$3">
        <YStack flex={1} height={1} bg="$borderColor" />
        <Text color="$colorSubtle" fontSize="$3">or continue with</Text>
        <YStack flex={1} height={1} bg="$borderColor" />
      </XStack>

      <SocialLoginButtons mode="login" />
    </YStack>
  );
}
