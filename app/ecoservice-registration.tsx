import { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView,
  Platform, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuthStore } from '@/store/authStore';
import { StepIndicator } from '@/features/ecoservice/registration/components/StepIndicator';
import { Step1Responsable } from '@/features/ecoservice/registration/components/Step1Responsable';
import { Step2Identidad } from '@/features/ecoservice/registration/components/Step2Identidad';
import { Step3Operacion } from '@/features/ecoservice/registration/components/Step3Operacion';
import { Step4Impacto } from '@/features/ecoservice/registration/components/Step4Impacto';
import { useCreateEnterpriseMutation } from '@/features/ecoservice/registration/hooks/useCreateEnterpriseMutation';
import {
  EMPTY_FORM, validateStep, buildHorarioSummary,
  type RegistrationForm,
} from '@/features/ecoservice/registration/types';

const STEP_LABELS = [
  'Información del responsable',
  'Identidad del emprendimiento',
  'Operación y presencia digital',
  'Impacto sostenible y archivos',
];

function buildPayload(form: RegistrationForm) {
  const REDUCE_MAP: Record<string, string> = {
    si: 'Si', en_proceso: 'En proceso', no: 'No',
  };
  const UBIC_MAP: Record<string, string> = {
    fisica: 'Física', virtual: 'Solo negocio virtual',
  };
  return {
    nombre_emprendimiento:           form.nombre_emprendimiento.trim(),
    nombre_entrepreneur:             form.nombre_entrepreneur.trim(),
    edad_emprendedor:                form.edad_emprendedor,
    celular_ventas:                  form.celular_ventas,
    descripcion_detallada:           form.descripcion_detallada.trim(),
    horario_atencion:                buildHorarioSummary(form.horario),
    tipo_ubicacion:                  UBIC_MAP[form.tipo_ubicacion] ?? form.tipo_ubicacion,
    link_google_maps:                form.tipo_ubicacion === 'fisica' ? form.link_google_maps.trim() : '',
    redes_sociales:                  JSON.stringify({ fb: form.red_fb.trim(), ig: form.red_ig.trim(), tt: form.red_tt.trim() }),
    tiempo_mercado:                  form.tiempo_mercado,
    actividades_sostenibles:         form.actividades_sostenibles.trim(),
    reduce_empaques:                 REDUCE_MAP[form.reduce_empaques] ?? form.reduce_empaques,
    resuelve_problematica_ambiental: form.resuelve_problematica_ambiental.trim(),
    foto_principal_url:              form.foto_principal_url.trim(),
    catalogo_pdf_url:                form.catalogo_pdf_url.trim(),
  };
}

export default function EcoServiceRegistrationScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const mutation = useCreateEnterpriseMutation();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegistrationForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField(key: keyof RegistrationForm, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    }
  }

  function goBack() {
    if (step > 0) {
      setErrors({});
      setStep(step - 1);
    } else {
      router.back();
    }
  }

  async function goNext() {
    const stepErrors = validateStep(step, form);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final submit
    const payload = buildPayload(form);
    console.log('📦 EcoService Registration Payload:', payload);
    console.log('👉 POST /api/enterprises');

    try {
      await mutation.mutateAsync(payload);
      if (user) {
        setUser({ ...user, role: 'ecoservice' });
      }
      router.replace('/(ecoservice)');
    } catch (err: any) {
      Alert.alert(
        'Error al registrar',
        err?.response?.data?.message ?? err?.message ?? 'Inténtalo de nuevo.',
      );
    }
  }

  const isLast = step === 3;

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={goBack} hitSlop={12} style={s.backBtn}>
          <Ionicons name={step === 0 ? 'close' : 'chevron-back'} size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Ionicons name="leaf" size={16} color="#22c55e" />
          <Text style={s.headerTitle}>Registro EcoService</Text>
        </View>
        <View style={s.headerRight} />
      </View>

      <StepIndicator total={4} current={step} label={STEP_LABELS[step]} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && <Step1Responsable form={form} setField={setField} errors={errors} />}
          {step === 1 && <Step2Identidad   form={form} setField={setField} errors={errors} />}
          {step === 2 && <Step3Operacion   form={form} setField={setField} errors={errors} />}
          {step === 3 && <Step4Impacto     form={form} setField={setField} errors={errors} />}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={s.footer}>
        <Text style={s.footerHint}>
          {step < 3 ? 'Tus datos se guardan al avanzar.' : 'Último paso — revisa y envía.'}
        </Text>
        <View style={s.footerBtns}>
          <TouchableOpacity
            style={[s.btnBack, step === 0 && s.btnDisabled]}
            onPress={goBack}
            disabled={step === 0}
          >
            <Ionicons name="chevron-back" size={18} color={step === 0 ? '#4b5563' : '#9ca3af'} />
            <Text style={[s.btnBackText, step === 0 && s.btnDisabledText]}>Atrás</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.btnNext, isLast && s.btnSubmit, mutation.isPending && s.btnDisabled]}
            onPress={goNext}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : isLast ? (
              <>
                <Ionicons name="paper-plane-outline" size={18} color="#ffffff" />
                <Text style={s.btnNextText}>Enviar registro</Text>
              </>
            ) : (
              <>
                <Text style={s.btnNextText}>Siguiente</Text>
                <Ionicons name="arrow-forward" size={18} color="#ffffff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const SURFACE    = '#0d1117';
const BORDER     = '#30363d';
const PRIMARY    = '#22c55e';
const TEXT_W     = '#ffffff';
const TEXT_S     = '#9ca3af';
const TEXT_M     = '#6b7280';

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: SURFACE },

  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn:       { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  headerTitle:   { fontSize: 15, fontWeight: '700', color: TEXT_W },
  headerRight:   { width: 36 },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },

  footer:        { borderTopWidth: 1, borderTopColor: BORDER, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, backgroundColor: SURFACE },
  footerHint:    { fontSize: 12, color: TEXT_M, marginBottom: 10, textAlign: 'center' },
  footerBtns:    { flexDirection: 'row', gap: 10 },

  btnBack:       { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderColor: BORDER, borderRadius: 14, paddingVertical: 14 },
  btnBackText:   { fontSize: 15, fontWeight: '600', color: TEXT_S },
  btnNext:       { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: PRIMARY, borderRadius: 14, paddingVertical: 14 },
  btnSubmit:     { backgroundColor: '#065F46' },
  btnNextText:   { fontSize: 15, fontWeight: '700', color: TEXT_W },
  btnDisabled:   { opacity: 0.45 },
  btnDisabledText:{ color: '#4b5563' },
});
