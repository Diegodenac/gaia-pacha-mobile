import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Tag } from '../types';

interface QuickFiltersProps {
  tags: Tag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
}

export function QuickFilters({ tags, selectedTagIds, onToggleTag }: QuickFiltersProps) {
  return (
    <View className="py-3">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {tags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id);
          return (
            <TouchableOpacity
              key={tag.id}
              onPress={() => onToggleTag(tag.id)}
              className={`px-4 py-2 rounded-full border ${
                isSelected 
                  ? 'bg-emerald-500 border-emerald-500' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              } shadow-sm`}
            >
              <Text 
                className={`font-medium ${
                  isSelected 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {tag.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
