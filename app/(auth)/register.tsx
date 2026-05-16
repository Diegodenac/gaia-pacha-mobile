import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Register Screen — placeholder for hackathon scaffolding */
export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface px-6 justify-center">
      <Text className="text-white font-bold text-2xl">Create Account</Text>
      <Text className="text-gray-400 mt-2">
        {/* TODO: Implement registration form — see login.tsx for pattern */}
        Role selection (Customer / EcoService) + form fields go here.
      </Text>
    </SafeAreaView>
  );
}
