import { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── SearchBar Molecule ───────────────────────────────────────────────────────
/**
 * SearchBar — browser-style search input with clear action.
 *
 * Layer: Molecule (TextInput + Ionicons composed with controlled state)
 * Used by: app/(customer)/index.tsx (via ExplorerFeedOrganism header)
 *
 * AI Hint: This molecule manages its own input value internally and
 * propagates changes via `onSearch`. Do NOT lift input state to the screen;
 * use debounce here if search becomes expensive.
 *
 * @example
 * <SearchBar onSearch={(term) => setFilters(f => ({ ...f, search: term }))} />
 */

interface SearchBarProps {
  onSearch:     (term: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search EcoServices & Products…',
}: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (text: string) => {
      setValue(text);
      onSearch(text);
    },
    [onSearch],
  );

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <View className="flex-row items-center mx-4 mb-3 px-4 py-3 rounded-2xl border border-surface-border"
      style={{ backgroundColor: '#333333' }}
    >
      <Ionicons name="search-outline" size={18} color="#9E9E9E" />
      <TextInput
        className="flex-1 text-white font-sans text-sm ml-2.5"
        placeholder={placeholder}
        placeholderTextColor="#9E9E9E"
        value={value}
        onChangeText={handleChange}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search bar"
        accessibilityHint="Type to search EcoServices and Products"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} accessibilityLabel="Clear search">
          <Ionicons name="close-circle" size={18} color="#9E9E9E" />
        </TouchableOpacity>
      )}
    </View>
  );
}
