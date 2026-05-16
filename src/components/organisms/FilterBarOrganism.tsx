import { ScrollView } from 'react-native';
import { FilterPill } from '@molecules/FilterPill';
import type { ExplorerFilter } from '@/types';

// ─── FilterBarOrganism ────────────────────────────────────────────────────────
/**
 * FilterBarOrganism — horizontal scrollable filter pill strip.
 *
 * Layer: Organism (stateless; active filter state is owned by the screen)
 * Used by: app/(customer)/index.tsx
 *
 * Filter Options (spec):
 *   All | Near Me (Bolivia) | Products | EcoServices | Carbon Footprint | Price
 *
 * AI Hint: To add a new filter, push a new entry to FILTER_OPTIONS below.
 * The ExplorerFilter union type in src/types/index.ts must be updated too.
 *
 * @example
 * <FilterBarOrganism activeFilter="all" onFilterChange={setActiveFilter} />
 */

interface FilterOption {
  key:   ExplorerFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all',         label: 'All'              },
  { key: 'near_me',     label: '📍 Near Me'        },
  { key: 'products',    label: 'Products'          },
  { key: 'ecoservices', label: '🌿 EcoServices'   },
  { key: 'carbon',      label: '♻️ Carbon Footprint' },
  { key: 'price',       label: '💰 Price'           },
];

interface FilterBarOrganismProps {
  activeFilter:   ExplorerFilter;
  onFilterChange: (filter: ExplorerFilter) => void;
}

export function FilterBarOrganism({
  activeFilter,
  onFilterChange,
}: FilterBarOrganismProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerStyle={{ paddingHorizontal: 16 }}
      accessibilityRole="tablist"
      accessibilityLabel="Explorer filter options"
    >
      {FILTER_OPTIONS.map(({ key, label }) => (
        <FilterPill
          key={key}
          label={label}
          isActive={activeFilter === key}
          onPress={() => onFilterChange(key)}
        />
      ))}
    </ScrollView>
  );
}
