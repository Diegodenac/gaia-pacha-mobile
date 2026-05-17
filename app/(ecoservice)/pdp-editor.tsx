import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PdpEditorScreen() {
  return (
    <SafeAreaView className="screen-container px-4 pt-4">
      <Text className="section-title">PDP Editor</Text>
      <View className="card mt-4">
        <Text className="text-gray-400 text-sm">Coming soon — create and edit product detail pages.</Text>
      </View>
    </SafeAreaView>
  );
}
