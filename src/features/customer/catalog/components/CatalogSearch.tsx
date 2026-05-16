import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';

interface CatalogSearchProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
}

export function CatalogSearch({ value, onChangeText, onFilterPress }: CatalogSearchProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="flex-row items-center space-x-3 px-4 py-3">
      {/* Search Input Container */}
      <View className="flex-1 flex-row items-center bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700">
        <Ionicons 
          name="search" 
          size={20} 
          color={isDark ? '#9CA3AF' : '#6B7280'} 
          className="mr-2"
        />
        <TextInput
          className="flex-1 text-base text-gray-800 dark:text-gray-100 font-sans"
          placeholder="Buscar eco-productos, emprendimientos..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
          value={value}
          onChangeText={onChangeText}
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} className="p-1">
            <Ionicons name="close-circle" size={18} color={isDark ? '#9CA3AF' : '#9CA3AF'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Advanced Filters Button */}
      {onFilterPress && (
        <TouchableOpacity 
          onPress={onFilterPress}
          className="bg-emerald-500 rounded-2xl p-3 shadow-sm justify-center items-center"
        >
          <Ionicons name="options-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
