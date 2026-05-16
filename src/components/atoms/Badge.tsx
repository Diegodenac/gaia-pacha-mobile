import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Badge Atom ───────────────────────────────────────────────────────────────
/**
 * Badge — semantic pill label atom for the Explorer feed cards.
 *
 * Layer: Atom (no imports from Molecules, Organisms, or Feature hooks)
 * Used by: ExplorerCard molecule
 *
 * Variants:
 *  - 'eco'      → EcoService label — green (#74A643 bg)
 *  - 'product'  → Product label   — earth-orange tones
 *  - 'co2'      → CO2 metric      — dark green bg (#3A5B13), leaf icon
 *  - 'verified' → Verified mark   — primary-500/20 bg
 *
 * AI Hint: To add a new badge variant, add a key to BADGE_CONFIG below.
 * Do NOT import feature hooks or repositories from this file.
 *
 * @example
 * <Badge variant="eco" />
 * <Badge variant="co2" label="CO2 -25%" />
 * <Badge variant="product" label="Product" />
 */

export type BadgeVariant = 'eco' | 'product' | 'co2' | 'verified';

interface BadgeConfig {
  containerClass: string;
  textClass:      string;
  defaultLabel:   string;
  icon?:          React.ComponentProps<typeof Ionicons>['name'];
}

const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig> = {
  eco: {
    containerClass: 'flex-row items-center rounded-full px-2 py-0.5 self-start',
    textClass:      'text-white text-[10px] font-medium ml-0.5',
    defaultLabel:   'EcoService',
    icon:           'leaf-outline',
  },
  product: {
    containerClass: 'flex-row items-center rounded-full px-2 py-0.5 self-start',
    textClass:      'text-white text-[10px] font-medium ml-0.5',
    defaultLabel:   'Product',
    icon:           'cube-outline',
  },
  co2: {
    containerClass: 'flex-row items-center rounded-full px-2 py-0.5 self-start',
    textClass:      'text-[10px] font-medium ml-0.5',
    defaultLabel:   'CO2 -0%',
    icon:           'leaf',
  },
  verified: {
    containerClass: 'flex-row items-center rounded-full px-2 py-0.5 self-start',
    textClass:      'text-[10px] font-medium ml-0.5',
    defaultLabel:   '✓ Verified',
  },
};

// Inline style objects — NativeWind JIT can't resolve runtime hex in all cases

const BADGE_STYLES = StyleSheet.create({
  eco:      { backgroundColor: '#74A643' },
  product:  { backgroundColor: '#e87010' },
  co2:      { backgroundColor: '#3A5B13' },
  verified: { backgroundColor: 'rgba(34,197,94,0.2)' },
  coText:   { color: '#74A643' },
  verText:  { color: '#4ade80' },
  white:    { color: '#ffffff' },
});

interface BadgeProps {
  variant: BadgeVariant;
  /** Overrides the default label text for the given variant */
  label?: string;
}

export function Badge({ variant, label }: BadgeProps) {
  const config = BADGE_CONFIG[variant];
  const displayLabel = label ?? config.defaultLabel;

  const textStyle =
    variant === 'co2'      ? BADGE_STYLES.coText  :
    variant === 'verified' ? BADGE_STYLES.verText  :
    BADGE_STYLES.white;

  return (
    <View className={config.containerClass} style={BADGE_STYLES[variant]}>
      {config.icon && (
        <Ionicons
          name={config.icon}
          size={10}
          color={variant === 'co2' ? '#74A643' : '#ffffff'}
        />
      )}
      <Text className={config.textClass} style={textStyle}>
        {displayLabel}
      </Text>
    </View>
  );
}
