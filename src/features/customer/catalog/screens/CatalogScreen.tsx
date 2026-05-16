import { SafeAreaView, View, FlatList, Text, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useCallback } from 'react';

import { useCatalog } from '../hooks/useCatalog';
import { CatalogSearch } from '../components/CatalogSearch';
import { QuickFilters } from '../components/QuickFilters';
import { CompanyCard } from '../components/CompanyCard';
import { GreenMessage } from '../components/GreenMessage';
import { AdvancedFiltersModal } from '../components/AdvancedFiltersModal';
import { Company } from '../types';
import { Typography } from '../../../../components/atoms/Typography';

export function CatalogScreen() {
  const {
    searchQuery,
    selectedTagIds,
    selectedCategoryId,
    isFiltersModalVisible,
    filteredCompanies,
    isLoading,
    isError,
    tags,
    categories,
    greenFacts,
    setSearchQuery,
    setSelectedCategoryId,
    setIsFiltersModalVisible,
    handleToggleTag,
    handleClearFilters,
  } = useCatalog();

  const renderHeader = useCallback(() => (
    <View className="mb-4">
      <View className="px-4 pt-6 pb-2">
        <Typography variant="h1" className="text-gray-900 dark:text-white">
          Descubre
        </Typography>
        <Typography variant="body" className="text-gray-500 dark:text-gray-400 mt-1">
          Emprendimientos verdes y sostenibles
        </Typography>
      </View>

      <CatalogSearch 
        value={searchQuery}
        onChangeText={setSearchQuery}
        onFilterPress={() => setIsFiltersModalVisible(true)}
      />

      <QuickFilters 
        tags={tags}
        selectedTagIds={selectedTagIds}
        onToggleTag={handleToggleTag}
      />
    </View>
  ), [searchQuery, setSearchQuery, setIsFiltersModalVisible, tags, selectedTagIds, handleToggleTag]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-20 px-4">
          <ActivityIndicator size="large" color="#10B981" />
          <Typography variant="body" className="text-gray-500 dark:text-gray-400 mt-4 text-center">
            Cargando emprendimientos...
          </Typography>
        </View>
      );
    }
    
    return (
      <View className="flex-1 items-center justify-center py-20 px-4">
        <Text className="text-6xl mb-4">🍃</Text>
        <Typography variant="h3" className="text-gray-800 dark:text-gray-200 text-center mb-2">
          No encontramos resultados
        </Typography>
        <Typography variant="body" className="text-gray-500 dark:text-gray-400 text-center">
          {isError ? "Error de conexión al servidor (backend)" : "Intenta ajustar tus filtros o buscar con otras palabras."}
        </Typography>
      </View>
    );
  }, [isLoading]);

  const renderItem = useCallback(({ item, index }: { item: Company, index: number }) => {
    // Interleave a GreenMessage after the 2nd item if one exists
    const showFact = index === 1 && greenFacts.length > 0;
    
    return (
      <View className="px-4">
        <CompanyCard 
          company={item} 
          onPress={(id) => {
            // TODO: Navigate to Company Detail Screen
            console.log('Navigate to company:', id);
          }} 
        />
        {showFact && <GreenMessage fact={greenFacts[0]} />}
      </View>
    );
  }, [greenFacts]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <FlatList
          data={filteredCompanies}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />

        <AdvancedFiltersModal
          visible={isFiltersModalVisible}
          onClose={() => setIsFiltersModalVisible(false)}
          categories={categories}
          selectedCategory={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onApply={() => setIsFiltersModalVisible(false)}
          onClear={handleClearFilters}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
