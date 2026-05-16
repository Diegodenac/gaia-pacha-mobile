import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';

// ─── Validation Schema ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Screen
 *
 * AI Hint: This is an auth screen. Business logic lives in useAuthStore (Zustand).
 * The API call itself is in src/repositories/auth.repository.ts.
 * Do NOT add API calls directly here.
 */
export default function LoginScreen() {
  const { login, isLoading } = useAuthStore();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface px-6 justify-center">
      {/* Header */}
      <View className="mb-10">
        <Text className="text-primary-400 font-bold text-4xl">Gaia Pacha</Text>
        <Text className="text-gray-400 font-sans text-base mt-2">
          Welcome back 🌿
        </Text>
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-gray-300 font-medium text-sm mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="input-field"
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text className="text-error text-xs mt-1">{errors.email.message}</Text>
        )}
      </View>

      {/* Password */}
      <View className="mb-6">
        <Text className="text-gray-300 font-medium text-sm mb-1">Password</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="input-field"
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text className="text-error text-xs mt-1">{errors.password.message}</Text>
        )}
      </View>

      {/* Submit */}
      <TouchableOpacity
        className="btn-primary"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
        accessibilityLabel="Sign in button"
      >
        <Text className="btn-primary-text">
          {isLoading ? 'Signing in…' : 'Sign In'}
        </Text>
      </TouchableOpacity>

      {/* Links */}
      <View className="flex-row justify-center mt-6 gap-4">
        <Link href="/(auth)/register">
          <Text className="text-primary-400 font-medium">Create account</Text>
        </Link>
        <Link href="/(auth)/forgot-password">
          <Text className="text-gray-400">Forgot password?</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
