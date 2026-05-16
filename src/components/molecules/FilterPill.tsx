import { TouchableOpacity, Text } from 'react-native';

// ─── FilterPill Molecule ──────────────────────────────────────────────────────
/**
 * FilterPill — single interactive filter tag for the Explorer filter bar.
 *
 * Layer: Molecule (TouchableOpacity + Text with active/inactive state styling)
 * Used by: FilterBarOrganism
 *
 * AI Hint: FilterPill is stateless — the active state is owned by
 * FilterBarOrganism and propagated down. Do NOT add local state here.
 *
 * @example
 * <FilterPill label="EcoServices" isActive={false} onPress={() => setFilter('ecoservices')} />
 */

interface FilterPillProps {
  label:    string;
  isActive: boolean;
  onPress:  () => void;
}

export function FilterPill({ label, isActive, onPress }: FilterPillProps) {
  return (
    <TouchableOpacity
      className={`mr-2 px-4 py-2 rounded-full border ${
        isActive
          ? 'bg-primary-500 border-primary-500'
          : 'border-surface-border'
      }`}
      style={isActive ? undefined : { backgroundColor: 'transparent' }}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`Filter: ${label}`}
    >
      <Text
        className={`text-xs font-medium ${isActive ? 'text-white' : 'text-[#9E9E9E]'}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
