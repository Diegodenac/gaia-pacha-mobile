import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Pressable,
  KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { authRepository } from '@/repositories/auth.repository';

const schema = z.object({
  email: z.string().email('Email inválido'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [sent, setSent] = useState(false);

  const { control, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    setIsLoading(true);
    try {
      await authRepository.forgotPassword(data.email);
      setSent(true);
    } catch (e: any) {
      setSubmitError(e?.message ?? 'Error al enviar el correo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={s.container}>
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color="#9ca3af" />
          </Pressable>

          {sent ? (
            <View style={s.successBox}>
              <View style={s.successIcon}>
                <Ionicons name="mail-outline" size={36} color="#22c55e" />
              </View>
              <Text style={s.successTitle}>Correo enviado</Text>
              <Text style={s.successBody}>
                Revisa tu bandeja en{' '}
                <Text style={s.successEmail}>{getValues('email')}</Text>
                {' '}y sigue las instrucciones para restablecer tu contraseña.
              </Text>
              <TouchableOpacity style={s.submitBtn} onPress={() => router.back()}>
                <Text style={s.submitBtnText}>Volver al inicio de sesión</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={s.header}>
                <Text style={s.title}>¿Olvidaste tu contraseña?</Text>
                <Text style={s.subtitle}>
                  Ingresa tu email y te enviaremos un enlace para restablecerla.
                </Text>
              </View>

              <View style={s.field}>
                <Text style={s.label}>Email</Text>
                <Controller
                  control={control} name="email"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={s.input}
                      placeholder="tu@email.com"
                      placeholderTextColor="#6b7280"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.email && <Text style={s.fieldError}>{errors.email.message}</Text>}
              </View>

              {submitError ? <Text style={s.submitError}>{submitError}</Text> : null}

              <TouchableOpacity
                style={s.submitBtn}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.submitBtnText}>Enviar enlace</Text>
                }
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#0d1117' },
  container:     { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  backBtn:       { marginBottom: 32 },
  header:        { marginBottom: 28 },
  title:         { fontSize: 26, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 },
  subtitle:      { fontSize: 15, color: '#6b7280', marginTop: 8, lineHeight: 22 },
  field:         { marginBottom: 20 },
  label:         { fontSize: 13, fontWeight: '600', color: '#9ca3af', marginBottom: 6 },
  input:         { backgroundColor: '#21262d', borderWidth: 1, borderColor: '#30363d', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#ffffff' },
  fieldError:    { fontSize: 12, color: '#ef4444', marginTop: 4 },
  submitError:   { fontSize: 13, color: '#ef4444', textAlign: 'center', marginBottom: 14 },
  submitBtn:     { backgroundColor: '#22c55e', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  successBox:    { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  successIcon:   { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(34,197,94,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle:  { fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 12 },
  successBody:   { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  successEmail:  { color: '#4ade80', fontWeight: '600' },
});
