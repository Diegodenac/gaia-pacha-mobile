import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Forgot Password Screen — placeholder */
export default function ForgotPasswordScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface px-6 justify-center">
      <Text className="text-white font-bold text-2xl">Reset Password</Text>
      <Text className="text-gray-400 mt-2">
        {/* TODO: Email input + send reset link */}
      </Text>
    </SafeAreaView>
  );
}
