import { Text, type TextProps } from 'react-native';

// ─── Typography Atom ──────────────────────────────────────────────────────────
/**
 * Typography — base text atom with semantic variants.
 *
 * AI Prompt: "Generate a Typography atom with variants: h1, h2, body, caption, label.
 * Apply NativeWind classes. Import from @atoms/Typography."
 *
 * @example
 * <Typography variant="h1">Hello World</Typography>
 * <Typography variant="caption" className="text-gray-400">Subtitle</Typography>
 */

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodySmall' | 'caption' | 'label';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<TypographyVariant, string> = {
  h1:        'text-white font-bold text-3xl',
  h2:        'text-white font-bold text-2xl',
  h3:        'text-white font-semi text-xl',
  body:      'text-gray-200 font-sans text-base',
  bodySmall: 'text-gray-300 font-sans text-sm',
  caption:   'text-gray-400 font-sans text-xs',
  label:     'text-gray-300 font-medium text-sm',
};

export function Typography({ variant = 'body', className, children, ...props }: TypographyProps) {
  const baseClass = VARIANT_CLASSES[variant];
  return (
    <Text className={`${baseClass} ${className ?? ''}`} {...props}>
      {children}
    </Text>
  );
}
