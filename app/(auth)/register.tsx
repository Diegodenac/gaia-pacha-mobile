import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Pressable,
  ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  email:           z.string().email('Email inválido'),
  password:        z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
  role:            z.enum(['customer', 'ecoservice']),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

// ── Password field with visibility toggle ─────────────────────────────────────

function PasswordField({
  value, onChange, placeholder, error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <View style={s.pwdRow}>
        <TextInput
          style={s.pwdInput}
          placeholder={placeholder ?? '••••••••'}
          placeholderTextColor="#6b7280"
          secureTextEntry={!visible}
          onChangeText={onChange}
          value={value}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          textContentType="newPassword"
        />
        <Pressable onPress={() => setVisible((v) => !v)} style={s.eyeBtn} hitSlop={8}>
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="#6b7280"
          />
        </Pressable>
      </View>
      {error ? <Text style={s.fieldError}>{error}</Text> : null}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const { register, isLoading } = useAuthStore();
  const router = useRouter();
  const [submitError, setSubmitError] = useState('');

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '', role: 'customer' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    setSubmitError('');
    try {
      await register(data.email, data.password, data.role);
    } catch (e: any) {
      setSubmitError(e?.message ?? 'Error al crear la cuenta');
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color="#9ca3af" />
          </Pressable>

          {/* Header */}
          <View style={s.header}>
            <Text style={s.title}>Crear Cuenta</Text>
            <Text style={s.subtitle}>Únete a la comunidad verde 🌱</Text>
          </View>

          {/* Role toggle */}
          <Controller
            control={control} name="role"
            render={({ field: { onChange, value } }) => (
              <View style={s.roleToggle}>
                <Pressable
                  style={[s.roleBtn, value === 'customer' && s.roleBtnActive]}
                  onPress={() => onChange('customer')}
                >
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={value === 'customer' ? '#22c55e' : '#6b7280'}
                  />
                  <Text style={[s.roleBtnText, value === 'customer' && s.roleBtnTextActive]}>
                    Cliente
                  </Text>
                </Pressable>
                <Pressable
                  style={[s.roleBtn, value === 'ecoservice' && s.roleBtnActive]}
                  onPress={() => onChange('ecoservice')}
                >
                  <Ionicons
                    name="storefront-outline"
                    size={16}
                    color={value === 'ecoservice' ? '#22c55e' : '#6b7280'}
                  />
                  <Text style={[s.roleBtnText, value === 'ecoservice' && s.roleBtnTextActive]}>
                    EcoService
                  </Text>
                </Pressable>
              </View>
            )}
          />

          {/* Email */}
          <View style={s.field}>
            <Text style={s.label}>Email</Text>
            <Controller
              control={control} name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="input-field"
                  placeholder="tu@email.com"
                  placeholderTextColor="#6b7280"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && <Text style={s.fieldError}>{errors.email.message}</Text>}
          </View>

          {/* Password */}
          <View style={s.field}>
            <Text style={s.label}>Contraseña</Text>
            <Controller
              control={control} name="password"
              render={({ field: { onChange, value } }) => (
                <PasswordField
                  value={value ?? ''}
                  onChange={onChange}
                  error={errors.password?.message}
                />
              )}
            />
          </View>

          {/* Confirm password */}
          <View style={s.field}>
            <Text style={s.label}>Confirmar contraseña</Text>
            <Controller
              control={control} name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <PasswordField
                  value={value ?? ''}
                  onChange={onChange}
                  placeholder="Repite tu contraseña"
                  error={errors.confirmPassword?.message}
                />
              )}
            />
          </View>

          {submitError ? <Text style={s.submitError}>{submitError}</Text> : null}

          {/* Submit */}
          <TouchableOpacity
            style={s.submitBtn}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.submitBtnText}>Crear Cuenta</Text>
            }
          </TouchableOpacity>

          {/* Footer link */}
          <View style={s.footer}>
            <Text style={s.footerText}>¿Ya tienes cuenta? </Text>
            <Link href="/(auth)/login">
              <Text style={s.footerLink}>Iniciar sesión</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:           { flex: 1, backgroundColor: '#0d1117' },
  scroll:         { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  backBtn:        { marginBottom: 20 },
  header:         { marginBottom: 24 },
  title:          { fontSize: 28, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 },
  subtitle:       { fontSize: 15, color: '#6b7280', marginTop: 4 },

  roleToggle:     { flexDirection: 'row', backgroundColor: '#161b22', borderRadius: 14, padding: 4, marginBottom: 24, borderWidth: 1, borderColor: '#30363d' },
  roleBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  roleBtnActive:  { backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.4)' },
  roleBtnText:    { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  roleBtnTextActive: { color: '#22c55e' },

  field:          { marginBottom: 16 },
  label:          { fontSize: 13, fontWeight: '600', color: '#9ca3af', marginBottom: 6 },
  pwdRow:         { flexDirection: 'row', alignItems: 'center', backgroundColor: '#21262d', borderWidth: 1, borderColor: '#30363d', borderRadius: 12 },
  pwdInput:       { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#ffffff' },
  eyeBtn:         { paddingHorizontal: 14, paddingVertical: 12 },
  fieldError:     { fontSize: 12, color: '#ef4444', marginTop: 4 },
  submitError:    { fontSize: 13, color: '#ef4444', textAlign: 'center', marginBottom: 14 },
  submitBtn:      { backgroundColor: '#22c55e', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  submitBtnText:  { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  footer:         { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText:     { fontSize: 14, color: '#6b7280' },
  footerLink:     { fontSize: 14, fontWeight: '600', color: '#4ade80' },
});
