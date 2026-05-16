import { View, TextInput, Text, type TextInputProps } from 'react-native';

// ─── Input Atom ───────────────────────────────────────────────────────────────
/**
 * Input — form text input atom with label and error state.
 *
 * AI Prompt: "Add a `leftIcon` prop to this Input atom that renders an
 * Ionicons icon inside the input on the left side, adjusting the padding."
 *
 * @example
 * <Input label="Email" placeholder="you@example.com" error={errors.email?.message} />
 */

interface InputProps extends TextInputProps {
  label?:       string;
  error?:       string;
  helperText?:  string;
}

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  const hasError = !!error;

  return (
    <View className="gap-1">
      {label && (
        <Text className="text-gray-300 font-medium text-sm">{label}</Text>
      )}
      <TextInput
        className={`input-field ${hasError ? 'border-error' : ''} ${className ?? ''}`}
        placeholderTextColor="#6b7280"
        {...props}
      />
      {hasError && (
        <Text className="text-error text-xs">{error}</Text>
      )}
      {helperText && !hasError && (
        <Text className="text-gray-500 text-xs">{helperText}</Text>
      )}
    </View>
  );
}
