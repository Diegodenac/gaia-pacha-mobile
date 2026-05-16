import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Company, Tag } from '../types';
import { MOCK_TAGS, MOCK_CATEGORIES, MOCK_GREEN_FACTS } from '../data/mockData';
import { catalogRepository } from '../../../../repositories/catalogRepository';

export function useCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);

  // Fetch from PostgreSQL backend instead of Mock Data
  const { data: apiCompanies = [], isLoading, isError } = useQuery({
    queryKey: ['companies-catalog'],
    queryFn: catalogRepository.getCatalog,
    // Optional: Refresh periodically or on focus for the MVP
  });

  // Toggle quick tags
  const handleToggleTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  }, []);

  // Filter companies based on search, category and tags
  const filteredCompanies = useMemo(() => {
    return apiCompanies.filter((company) => {
      // 1. Search Query Match (company name, description, or product names)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        (company.name && company.name.toLowerCase().includes(q)) ||
        (company.description && company.description.toLowerCase().includes(q)) ||
        (company.products && company.products.some(p => p.name.toLowerCase().includes(q)));

      // 2. Category Match
      const matchesCategory = !selectedCategoryId || (company.category && company.category.id === selectedCategoryId);

      // 3. Tags Match (if tags selected, company must have AT LEAST ONE selected tag)
      const matchesTags = selectedTagIds.length === 0 || 
        (company.tags && selectedTagIds.some(tagId => company.tags.some(t => t.id === tagId)));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [apiCompanies, searchQuery, selectedTagIds, selectedCategoryId]);

  const handleClearFilters = useCallback(() => {
    setSelectedTagIds([]);
    setSelectedCategoryId(null);
  }, []);

  return {
    // State
    searchQuery,
    selectedTagIds,
    selectedCategoryId,
    isFiltersModalVisible,
    
    // Derived
    filteredCompanies,
    isLoading,
    isError,
    tags: MOCK_TAGS,
    categories: MOCK_CATEGORIES,
    greenFacts: MOCK_GREEN_FACTS,

    // Actions
    setSearchQuery,
    setSelectedCategoryId,
    setIsFiltersModalVisible,
    handleToggleTag,
    handleClearFilters,
  };
}
