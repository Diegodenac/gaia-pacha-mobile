import { View, type ViewProps } from 'react-native';

// ─── Card Atom ────────────────────────────────────────────────────────────────
/**
 * Card — surface container atom.
 *
 * AI Prompt: "Add a `pressable` prop to this Card atom that wraps
 * the content in TouchableOpacity with a scale animation on press."
 *
 * @example
 * <Card className="mb-4">
 *   <Typography variant="h3">Title</Typography>
 * </Card>
 */

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, elevated = false, className, ...props }: CardProps) {
  return (
    <View
      className={`card ${elevated ? 'shadow-glow' : ''} ${className ?? ''}`}
      {...props}
    >
      {children}
    </View>
  );
}
