import { Modal, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { Typography } from '../../../../components/atoms/Typography';
import { Button } from '../../../../components/atoms/Button';

interface AdvancedFiltersModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  onApply: () => void;
  onClear: () => void;
}

export function AdvancedFiltersModal({
  visible,
  onClose,
  categories,
  selectedCategory,
  onSelectCategory,
  onApply,
  onClear
}: AdvancedFiltersModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white dark:bg-gray-900 rounded-t-3xl h-3/4">
          <SafeAreaView className="flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <Typography variant="h3" className="text-gray-900 dark:text-white">
                Filtros Avanzados
              </Typography>
              <TouchableOpacity onPress={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
              {/* Category Filter */}
              <View className="mb-6">
                <Typography variant="h3" className="text-gray-800 dark:text-gray-200 mb-3 text-lg">
                  Categoría
                </Typography>
                <View className="flex-row flex-wrap gap-2">
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => onSelectCategory(selectedCategory === cat.id ? null : cat.id)}
                      className={`px-4 py-2 rounded-xl border ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Text className={selectedCategory === cat.id ? 'text-white font-medium' : 'text-gray-600 dark:text-gray-300'}>
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Eco Impact Filter (Mock) */}
              <View className="mb-6">
                <Typography variant="h3" className="text-gray-800 dark:text-gray-200 mb-3 text-lg">
                  Impacto Ecológico Mínimo
                </Typography>
                <View className="flex-row justify-between bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
                  {['Todos', 'Medio', 'Alto'].map((impact, idx) => (
                    <TouchableOpacity
                      key={impact}
                      className={`flex-1 py-2 items-center rounded-lg ${idx === 0 ? 'bg-white shadow-sm dark:bg-gray-700' : ''}`}
                    >
                      <Text className={idx === 0 ? 'text-emerald-600 font-medium' : 'text-gray-500'}>
                        {impact}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Footer Buttons */}
            <View className="p-4 border-t border-gray-100 dark:border-gray-800 flex-row gap-3">
              <TouchableOpacity
                onPress={onClear}
                className="flex-1 py-3 items-center rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <Text className="text-gray-600 dark:text-gray-300 font-medium">Limpiar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onApply}
                className="flex-[2] bg-emerald-500 py-3 items-center rounded-xl shadow-sm"
              >
                <Text className="text-white font-bold">Aplicar Filtros</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
