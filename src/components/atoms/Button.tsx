import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from 'react-native';
import type { Variant, Size } from '@/types';

// ─── Button Atom ──────────────────────────────────────────────────────────────
/**
 * Button — base interactive atom.
 *
 * AI Prompt: "Extend this Button atom to support an `icon` prop (left/right Ionicons icon).
 * Keep the existing variant and size system intact."
 *
 * @example
 * <Button variant="primary" onPress={handleSubmit}>Sign In</Button>
 * <Button variant="ghost" size="sm" loading>Loading…</Button>
 */

interface ButtonProps extends TouchableOpacityProps {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  children:  React.ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:   'bg-primary-500',
  secondary: 'bg-surface-overlay border border-surface-border',
  ghost:     'border border-surface-border bg-transparent',
  danger:    'bg-error',
};

const TEXT_CLASSES: Record<Variant, string> = {
  primary:   'text-white font-semi',
  secondary: 'text-white font-medium',
  ghost:     'text-gray-300 font-medium',
  danger:    'text-white font-semi',
};

const SIZE_CLASSES: Record<Size, { container: string; text: string }> = {
  xs: { container: 'px-3 py-1.5 rounded-lg',  text: 'text-xs' },
  sm: { container: 'px-4 py-2 rounded-xl',     text: 'text-sm' },
  md: { container: 'px-6 py-3 rounded-xl',     text: 'text-base' },
  lg: { container: 'px-8 py-4 rounded-2xl',    text: 'text-lg' },
  xl: { container: 'px-10 py-5 rounded-2xl',   text: 'text-xl' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantClass = VARIANT_CLASSES[variant];
  const textClass    = TEXT_CLASSES[variant];
  const sizeClasses  = SIZE_CLASSES[size];

  return (
    <TouchableOpacity
      className={`items-center justify-center ${variantClass} ${sizeClasses.container} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text className={`${textClass} ${sizeClasses.text}`}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
