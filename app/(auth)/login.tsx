import { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Pressable,
  KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { login, isLoading } = useAuthStore();
  const [showPwd, setShowPwd] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitError('');
    try {
      await login(data.email, data.password);
    } catch (e: any) {
      setSubmitError(e?.message ?? 'Error al iniciar sesión');
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={s.container}>
          <View style={s.header}>
            <Text style={s.brand}>Gaia Pacha</Text>
            <Text style={s.subtitle}>Bienvenido de vuelta 🌿</Text>
          </View>

          {/* Email */}
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

          {/* Contraseña */}
          <View style={s.field}>
            <Text style={s.label}>Contraseña</Text>
            <Controller
              control={control} name="password"
              render={({ field: { onChange, value } }) => (
                <View style={s.pwdRow}>
                  <TextInput
                    style={s.pwdInput}
                    placeholder="••••••••"
                    placeholderTextColor="#6b7280"
                    secureTextEntry={!showPwd}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    textContentType="password"
                  />
                  <Pressable onPress={() => setShowPwd((v) => !v)} style={s.eyeBtn} hitSlop={8}>
                    <Ionicons
                      name={showPwd ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#6b7280"
                    />
                  </Pressable>
                </View>
              )}
            />
            {errors.password && <Text style={s.fieldError}>{errors.password.message}</Text>}
          </View>

          {submitError ? <Text style={s.submitError}>{submitError}</Text> : null}

          <TouchableOpacity
            style={s.submitBtn}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.submitBtnText}>Iniciar Sesión</Text>
            }
          </TouchableOpacity>

          <View style={s.footer}>
            <Link href="/(auth)/register">
              <Text style={s.footerLink}>Crear cuenta</Text>
            </Link>
            <Text style={s.footerSep}>·</Text>
            <Link href="/(auth)/forgot-password">
              <Text style={s.footerMuted}>¿Olvidaste tu contraseña?</Text>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: '#0d1117' },
  container:     { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
  header:        { marginBottom: 32 },
  brand:         { fontSize: 34, fontWeight: '800', color: '#22c55e', letterSpacing: -1 },
  subtitle:      { fontSize: 16, color: '#6b7280', marginTop: 6 },
  field:         { marginBottom: 16 },
  label:         { fontSize: 13, fontWeight: '600', color: '#9ca3af', marginBottom: 6 },
  input:         { backgroundColor: '#21262d', borderWidth: 1, borderColor: '#30363d', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#ffffff' },
  pwdRow:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#21262d', borderWidth: 1, borderColor: '#30363d', borderRadius: 12 },
  pwdInput:      { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#ffffff' },
  eyeBtn:        { paddingHorizontal: 14, paddingVertical: 12 },
  fieldError:    { fontSize: 12, color: '#ef4444', marginTop: 4 },
  submitError:   { fontSize: 13, color: '#ef4444', textAlign: 'center', marginBottom: 14 },
  submitBtn:     { backgroundColor: '#22c55e', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4, marginBottom: 24 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  footer:        { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  footerLink:    { fontSize: 14, fontWeight: '600', color: '#4ade80' },
  footerSep:     { fontSize: 14, color: '#374151' },
  footerMuted:   { fontSize: 14, color: '#6b7280' },
});
