import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Checkbox, Input, Label, Spinner, Text, XStack, YStack } from 'tamagui';
import { useAuth } from '../hooks/useAuth';
import { signUpSchema, type SignUpFormValues } from '../schemas/auth.schemas';
import { SocialLoginButtons } from './SocialLoginButtons';

export function SignUpForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [apiError, setApiError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: standardSchemaResolver(signUpSchema),
    defaultValues: { terms: false },
  });

  async function onSubmit(values: SignUpFormValues) {
    setApiError('');
    try {
      await register(values.email, values.password, values.full_name);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : 'Registration failed. Please try again.');
    }
  }

  return (
    <YStack gap="$4" width="100%">
      <YStack gap="$2">
        <Controller
          control={control}
          name="full_name"
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Full name" value={value} onChangeText={onChange} rounded={12} borderColor={errors.full_name ? '$red8' : '$borderColor'} height={52} px="$4" fontSize="$4" accessibilityLabel="Full name" />
          )}
        />
        {errors.full_name && <Text color="$red10" fontSize={13}>{errors.full_name.message}</Text>}
      </YStack>

      <YStack gap="$2">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Email address" autoCapitalize="none" keyboardType="email-address" autoComplete="email" value={value} onChangeText={onChange} rounded={12} borderColor={errors.email ? '$red8' : '$borderColor'} height={52} px="$4" fontSize="$4" accessibilityLabel="Email address" />
          )}
        />
        {errors.email && <Text color="$red10" fontSize={13}>{errors.email.message}</Text>}
      </YStack>

      <YStack gap="$2">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Password (min 8 chars)" secureTextEntry value={value} onChangeText={onChange} rounded={12} borderColor={errors.password ? '$red8' : '$borderColor'} height={52} px="$4" fontSize="$4" accessibilityLabel="Password" />
          )}
        />
        {errors.password && <Text color="$red10" fontSize={13}>{errors.password.message}</Text>}
      </YStack>

      <YStack gap="$2">
        <Controller
          control={control}
          name="confirm_password"
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Confirm password" secureTextEntry value={value} onChangeText={onChange} rounded={12} borderColor={errors.confirm_password ? '$red8' : '$borderColor'} height={52} px="$4" fontSize="$4" accessibilityLabel="Confirm password" />
          )}
        />
        {errors.confirm_password && <Text color="$red10" fontSize={13}>{errors.confirm_password.message}</Text>}
      </YStack>

      <Controller
        control={control}
        name="terms"
        render={({ field: { onChange, value } }) => (
          <YStack gap="$1">
            <XStack gap="$2" items="center">
              <Checkbox
                id="terms"
                checked={value}
                onCheckedChange={(v) => onChange(v === true)}
                size="$4"
                rounded={6}
                accessibilityLabel="Accept terms and conditions"
              >
                <Checkbox.Indicator>
                  <Text>✓</Text>
                </Checkbox.Indicator>
              </Checkbox>
              <Label htmlFor="terms" fontSize="$3" color="$colorSubtle">
                I agree to the{' '}
                <Text color="$blue10" fontWeight="600">Terms of Service</Text>
                {' '}and{' '}
                <Text color="$blue10" fontWeight="600">Privacy Policy</Text>
              </Label>
            </XStack>
            {errors.terms && <Text color="$red10" fontSize={13}>{errors.terms.message}</Text>}
          </YStack>
        )}
      />

      {apiError ? (
        <XStack bg="$red2" rounded={10} p="$3" borderWidth={1} borderColor="$red6">
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
        accessibilityLabel="Create account"
        accessibilityRole="button"
      >
        {isSubmitting ? <Spinner color="white" /> : <Text color="white" fontWeight="700" fontSize="$5">Create Account</Text>}
      </Button>

      <XStack items="center" gap="$3">
        <YStack flex={1} height={1} bg="$borderColor" />
        <Text color="$colorSubtle" fontSize="$3">or sign up with</Text>
        <YStack flex={1} height={1} bg="$borderColor" />
      </XStack>

      <SocialLoginButtons mode="signup" />
    </YStack>
  );
}
