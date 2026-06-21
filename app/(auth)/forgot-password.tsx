import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Spinner, Text, XStack, YStack } from 'tamagui';
import { z } from 'zod';
import { resetPassword } from '../../services/auth.service';

const schema = z.object({ email: z.string().email('Enter a valid email') });
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const [apiError, setApiError] = useState('');

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
  });

  async function onSubmit({ email }: FormValues) {
    setApiError('');
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e: unknown) {
      setApiError(e instanceof Error ? e.message : 'Failed to send reset email.');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <YStack flex={1} px="$5" pt="$8" gap="$5">
          <Button chromeless onPress={() => router.back()} self="flex-start" accessibilityLabel="Go back">
            <Text color="$blue10" fontSize="$4">← Back</Text>
          </Button>

          <YStack gap="$2">
            <Text fontSize="$7" fontWeight="800">Reset Password</Text>
            <Text color="$colorSubtle" fontSize="$4" lineHeight={22}>
              Enter your email and we'll send you a link to reset your password.
            </Text>
          </YStack>

          {sent ? (
            <YStack bg="$green2" rounded={12} p="$4" gap="$2">
              <Text fontSize="$4" fontWeight="700" color="$green10">Email sent! ✓</Text>
              <Text color="$colorSubtle" fontSize="$3">Check your inbox for the reset link.</Text>
            </YStack>
          ) : (
            <YStack gap="$3">
              <YStack gap="$2">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <Input placeholder="Email address" autoCapitalize="none" keyboardType="email-address" value={value} onChangeText={onChange} rounded={12} borderColor={errors.email ? '$red8' : '$borderColor'} height={52} px="$4" fontSize="$4" />
                  )}
                />
                {errors.email && <Text color="$red10" fontSize={13}>{errors.email.message}</Text>}
              </YStack>

              {apiError ? (
                <XStack bg="$red2" rounded={10} p="$3" borderWidth={1} borderColor="$red6">
                  <Text color="$red10" fontSize="$3">{apiError}</Text>
                </XStack>
              ) : null}

              <Button onPress={handleSubmit(onSubmit)} theme="blue" rounded={14} height={52} disabled={isSubmitting}>
                {isSubmitting ? <Spinner color="white" /> : <Text color="white" fontWeight="700" fontSize="$5">Send Reset Link</Text>}
              </Button>
            </YStack>
          )}
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
