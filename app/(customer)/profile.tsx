import { useState } from 'react';
import {
  View, Text, Modal, Pressable, TextInput, TouchableOpacity,
  Switch, ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useDevStore } from '@/store/devStore';

// ── Schemas ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

const signupSchema = z.object({
  email:           z.string().email('Email inválido'),
  password:        z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type LoginForm  = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

// ── Password input con toggle de visibilidad ──────────────────────────────────

function PasswordInput({
  value, onChange, placeholder, error,
  textContentType = 'password',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  textContentType?: 'password' | 'newPassword';
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View>
      <View style={m.pwdRow}>
        <TextInput
          style={m.pwdInput}
          placeholder={placeholder ?? '••••••••'}
          placeholderTextColor="#6b7280"
          secureTextEntry={!visible}
          onChangeText={onChange}
          value={value}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          textContentType={textContentType}
        />
        <Pressable onPress={() => setVisible((v) => !v)} style={m.eyeBtn} hitSlop={8}>
          <Ionicons
            name={visible ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color="#6b7280"
          />
        </Pressable>
      </View>
      {error ? <Text style={m.fieldError}>{error}</Text> : null}
    </View>
  );
}

// ── Modal de autenticación (login ↔ signup) ───────────────────────────────────

type AuthView = 'login' | 'signup';

function AuthModal({
  visible, initialView, onClose, onAuthSuccess,
}: {
  visible: boolean;
  initialView: AuthView;
  onClose: () => void;
  onAuthSuccess: () => void;
}) {
  const [view, setView] = useState<AuthView>(initialView);
  const [submitError, setSubmitError] = useState('');
  const { login, register, isLoading } = useAuthStore();
  const insets = useSafeAreaInsets();

  const handleOpen = () => {
    setView(initialView);
    setSubmitError('');
  };

  // Login form
  const { control: lCtrl, handleSubmit: lSubmit, formState: { errors: lErr }, reset: lReset } =
    useForm<LoginForm>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: '', password: '' },
    });

  const onLogin = async (data: LoginForm) => {
    setSubmitError('');
    try {
      await login(data.email, data.password);
      onAuthSuccess();
    } catch (e: any) {
      setSubmitError(e?.message ?? 'Credenciales incorrectas');
    }
  };

  // Signup form
  const { control: sCtrl, handleSubmit: sSubmit, formState: { errors: sErr }, reset: sReset } =
    useForm<SignupForm>({
      resolver: zodResolver(signupSchema),
      defaultValues: { email: '', password: '', confirmPassword: '' },
    });

  const onSignup = async (data: SignupForm) => {
    setSubmitError('');
    try {
      await register(data.email, data.password, 'customer');
      onAuthSuccess();
    } catch (e: any) {
      setSubmitError(e?.message ?? 'Error al crear la cuenta');
    }
  };

  const switchView = (next: AuthView) => {
    setSubmitError('');
    lReset();
    sReset();
    setView(next);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onShow={handleOpen}
      onRequestClose={onClose}
    >
      <Pressable style={m.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={m.sheetWrap}
      >
        <View style={[m.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={m.handle} />

          <View style={m.sheetHeader}>
            <Text style={m.sheetTitle}>
              {view === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </Text>
            <Pressable onPress={onClose} hitSlop={12} style={m.closeBtn}>
              <Ionicons name="close" size={22} color="#6b7280" />
            </Pressable>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {view === 'login' ? (
              <View style={m.formBody}>
                {/* Email */}
                <View style={m.fieldWrap}>
                  <Text style={m.label}>Email</Text>
                  <Controller
                    control={lCtrl} name="email"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={m.input}
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
                  {lErr.email && <Text style={m.fieldError}>{lErr.email.message}</Text>}
                </View>

                {/* Contraseña */}
                <View style={m.fieldWrap}>
                  <Text style={m.label}>Contraseña</Text>
                  <Controller
                    control={lCtrl} name="password"
                    render={({ field: { onChange, value } }) => (
                      <PasswordInput value={value} onChange={onChange} error={lErr.password?.message} textContentType="password" />
                    )}
                  />
                </View>

                {submitError ? <Text style={m.submitError}>{submitError}</Text> : null}

                <TouchableOpacity style={m.submitBtn} onPress={lSubmit(onLogin)} disabled={isLoading}>
                  {isLoading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={m.submitBtnText}>Iniciar Sesión</Text>
                  }
                </TouchableOpacity>

                <Pressable onPress={() => switchView('signup')} style={m.switchLink}>
                  <Text style={m.switchText}>
                    ¿No tienes cuenta?{' '}
                    <Text style={m.switchAccent}>Crear cuenta</Text>
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={m.formBody}>
                {/* Email */}
                <View style={m.fieldWrap}>
                  <Text style={m.label}>Email</Text>
                  <Controller
                    control={sCtrl} name="email"
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={m.input}
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
                  {sErr.email && <Text style={m.fieldError}>{sErr.email.message}</Text>}
                </View>

                {/* Contraseña */}
                <View style={m.fieldWrap}>
                  <Text style={m.label}>Contraseña</Text>
                  <Controller
                    control={sCtrl} name="password"
                    render={({ field: { onChange, value } }) => (
                      <PasswordInput value={value} onChange={onChange} error={sErr.password?.message} textContentType="newPassword" />
                    )}
                  />
                </View>

                {/* Confirmar contraseña */}
                <View style={m.fieldWrap}>
                  <Text style={m.label}>Confirmar contraseña</Text>
                  <Controller
                    control={sCtrl} name="confirmPassword"
                    render={({ field: { onChange, value } }) => (
                      <PasswordInput value={value} onChange={onChange} placeholder="Repite tu contraseña" error={sErr.confirmPassword?.message} textContentType="newPassword" />
                    )}
                  />
                </View>

                {submitError ? <Text style={m.submitError}>{submitError}</Text> : null}

                <TouchableOpacity style={m.submitBtn} onPress={sSubmit(onSignup)} disabled={isLoading}>
                  {isLoading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={m.submitBtnText}>Crear Cuenta</Text>
                  }
                </TouchableOpacity>

                <Pressable onPress={() => switchView('login')} style={m.switchLink}>
                  <Text style={m.switchText}>
                    ¿Ya tienes cuenta?{' '}
                    <Text style={m.switchAccent}>Iniciar sesión</Text>
                  </Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ── Pantalla de Perfil ────────────────────────────────────────────────────────

export default function CustomerProfileScreen() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { previewAsEcoService, togglePreview } = useDevStore();
  const router = useRouter();
  const [authModal, setAuthModal] = useState<AuthView | null>(null);

  function handlePreviewToggle(value: boolean) {
    togglePreview();
    if (value) router.replace('/(ecoservice)');
  }

  function handleAuthSuccess() {
    setAuthModal(null);
    router.replace('/(customer)');
  }

  const initial = user?.email ? user.email[0].toUpperCase() : '?';

  // ── Estado autenticado ──────────────────────────────────────────────────────
  if (isAuthenticated && user) {
    return (
      <SafeAreaView style={p.root} edges={['top']}>
        <ScrollView contentContainerStyle={p.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={p.screenTitle}>Mi Perfil</Text>

          {/* Tarjeta de usuario */}
          <View style={p.userCard}>
            <View style={p.avatarCircle}>
              <Text style={p.avatarText}>{initial}</Text>
            </View>
            <View style={p.userInfo}>
              <Text style={p.userEmail}>{user.email}</Text>
              <View style={p.badgeRow}>
                <View style={p.badge}>
                  <Text style={p.badgeText}>Cliente</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Switch de preview dev */}
          <View style={p.rowCard}>
            <View style={p.rowLabel}>
              <Ionicons name="flask-outline" size={16} color="#6b7280" />
              <Text style={p.rowLabelText}>Preview EcoService tabs</Text>
            </View>
            <Switch
              value={previewAsEcoService}
              onValueChange={handlePreviewToggle}
              trackColor={{ false: '#374151', true: '#059669' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Cerrar sesión */}
          <TouchableOpacity style={p.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            <Text style={p.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Estado guest ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={p.root} edges={['top']}>
      <ScrollView contentContainerStyle={p.guestScroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={p.hero}>
          <View style={p.heroIconWrap}>
            <Ionicons name="leaf" size={40} color="#22c55e" />
          </View>
          <Text style={p.heroTitle}>Gaia Pacha</Text>
          <Text style={p.heroSubtitle}>
            Conecta con emprendimientos verdes,{'\n'}guarda favoritos y mucho más.
          </Text>
        </View>

        {/* CTAs */}
        <View style={p.ctaSection}>
          <TouchableOpacity style={p.ctaPrimary} onPress={() => setAuthModal('signup')}>
            <Text style={p.ctaPrimaryText}>Crear cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={p.ctaGhost} onPress={() => setAuthModal('login')}>
            <Text style={p.ctaGhostText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>

        {/* Beneficios */}
        <View style={p.benefitsList}>
          {[
            { icon: 'heart-outline',        text: 'Guarda tus emprendimientos favoritos' },
            { icon: 'receipt-outline',       text: 'Historial de pedidos y seguimiento' },
            { icon: 'notifications-outline', text: 'Notificaciones de impacto ambiental' },
          ].map(({ icon, text }) => (
            <View key={icon} style={p.benefitRow}>
              <Ionicons name={icon as any} size={16} color="#4ade80" />
              <Text style={p.benefitText}>{text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {authModal !== null && (
        <AuthModal
          visible
          initialView={authModal}
          onClose={() => setAuthModal(null)}
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </SafeAreaView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const SURFACE        = '#0d1117';
const SURFACE_RAISED = '#161b22';
const SURFACE_INPUT  = '#21262d';
const BORDER         = '#30363d';
const PRIMARY        = '#22c55e';
const PRIMARY_LIGHT  = '#4ade80';
const TEXT_WHITE     = '#ffffff';
const TEXT_SECONDARY = '#9ca3af';
const TEXT_MUTED     = '#6b7280';
const RED            = '#ef4444';

const m = StyleSheet.create({
  backdrop:      { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.65)' },
  sheetWrap:     { flex: 1, justifyContent: 'flex-end' },
  sheet:         { backgroundColor: SURFACE_RAISED, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, paddingHorizontal: 20, maxHeight: '92%' },
  handle:        { width: 40, height: 4, backgroundColor: BORDER, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  sheetTitle:    { fontSize: 20, fontWeight: '700', color: TEXT_WHITE },
  closeBtn:      { padding: 4 },
  formBody:      { paddingBottom: 8 },
  fieldWrap:     { marginBottom: 14 },
  label:         { fontSize: 13, fontWeight: '600', color: TEXT_SECONDARY, marginBottom: 6 },
  input:         { backgroundColor: SURFACE_INPUT, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: TEXT_WHITE },
  pwdRow:        { flexDirection: 'row', alignItems: 'center', backgroundColor: SURFACE_INPUT, borderWidth: 1, borderColor: BORDER, borderRadius: 12 },
  pwdInput:      { flex: 1, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: TEXT_WHITE },
  eyeBtn:        { paddingHorizontal: 14, paddingVertical: 12 },
  fieldError:    { fontSize: 12, color: RED, marginTop: 4 },
  submitError:   { fontSize: 13, color: RED, textAlign: 'center', marginBottom: 12 },
  submitBtn:     { backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  submitBtnText: { color: TEXT_WHITE, fontSize: 16, fontWeight: '700' },
  switchLink:    { alignItems: 'center', marginTop: 16, paddingBottom: 4 },
  switchText:    { fontSize: 14, color: TEXT_MUTED },
  switchAccent:  { color: PRIMARY_LIGHT, fontWeight: '600' },
});

const p = StyleSheet.create({
  root:          { flex: 1, backgroundColor: SURFACE },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  screenTitle:   { fontSize: 22, fontWeight: '800', color: TEXT_WHITE, marginBottom: 20 },

  userCard:      { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: SURFACE_RAISED, borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: BORDER },
  avatarCircle:  { width: 52, height: 52, borderRadius: 26, backgroundColor: '#14532d', borderWidth: 2, borderColor: PRIMARY, alignItems: 'center', justifyContent: 'center' },
  avatarText:    { fontSize: 20, fontWeight: '800', color: PRIMARY_LIGHT },
  userInfo:      { flex: 1, gap: 2 },
  userEmail:     { fontSize: 15, fontWeight: '600', color: TEXT_WHITE },
  badgeRow:      { marginTop: 6 },
  badge:         { alignSelf: 'flex-start', backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:     { fontSize: 12, fontWeight: '600', color: PRIMARY_LIGHT },

  rowCard:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: SURFACE_RAISED, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10, borderWidth: 1, borderColor: BORDER },
  rowLabel:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowLabelText:  { fontSize: 14, color: TEXT_SECONDARY },

  logoutBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: BORDER, borderRadius: 14, paddingVertical: 14, marginTop: 4 },
  logoutText:    { fontSize: 15, fontWeight: '600', color: RED },

  guestScroll:    { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 48, justifyContent: 'center' },
  hero:           { alignItems: 'center', marginBottom: 36 },
  heroIconWrap:   { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(34,197,94,0.12)', borderWidth: 1.5, borderColor: 'rgba(34,197,94,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  heroTitle:      { fontSize: 30, fontWeight: '800', color: TEXT_WHITE, marginBottom: 10, letterSpacing: -0.5 },
  heroSubtitle:   { fontSize: 15, color: TEXT_MUTED, textAlign: 'center', lineHeight: 22 },
  ctaSection:     { gap: 12, marginBottom: 36 },
  ctaPrimary:     { backgroundColor: PRIMARY, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  ctaPrimaryText: { fontSize: 16, fontWeight: '700', color: TEXT_WHITE },
  ctaGhost:       { borderWidth: 1.5, borderColor: BORDER, borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  ctaGhostText:   { fontSize: 16, fontWeight: '600', color: TEXT_SECONDARY },
  benefitsList:   { gap: 14, paddingHorizontal: 4 },
  benefitRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  benefitText:    { fontSize: 14, color: TEXT_MUTED, flex: 1 },
});
