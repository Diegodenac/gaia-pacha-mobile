import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GreenFact } from '../types';

interface GreenMessageProps {
  fact: GreenFact;
}

export function GreenMessage({ fact }: GreenMessageProps) {
  return (
    <View className={`${fact.bgColor} rounded-2xl p-4 flex-row items-center my-4 mx-2 shadow-sm`}>
      <View className="bg-white/30 p-2 rounded-full mr-3">
        {/* We use any for icon name since it comes from mock data strings */}
        <Ionicons name={fact.icon as any} size={24} color="#047857" />
      </View>
      <Text className="flex-1 text-emerald-900 dark:text-emerald-100 font-medium text-sm leading-5">
        {fact.message}
      </Text>
    </View>
  );
}
