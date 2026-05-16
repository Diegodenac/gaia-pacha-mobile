import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/** Customer Map Screen — discover nearby EcoServices on an interactive map */
export default function MapScreen() {
  return (
    <SafeAreaView className="screen-container">
      <View className="flex-1 items-center justify-center">
        <Text className="text-white font-bold text-xl">Nearby Services</Text>
        <Text className="text-gray-400 mt-2 text-center px-8">
          {/* TODO: Integrate react-native-maps + useNearbyServicesQuery */}
          Map will render here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
