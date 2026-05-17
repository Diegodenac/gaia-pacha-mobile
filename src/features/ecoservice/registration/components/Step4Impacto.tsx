import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RegistrationForm } from '../types';

const REDUCE_OPTIONS = [
  { value: 'si',         label: 'Sí, activamente',      icon: 'checkmark-circle-outline' as const },
  { value: 'en_proceso', label: 'En proceso',            icon: 'time-outline' as const },
  { value: 'no',         label: 'Aún no',                icon: 'close-circle-outline' as const },
];

interface Props {
  form: RegistrationForm;
  setField: (key: keyof RegistrationForm, value: string) => void;
  errors: Record<string, string>;
}

export function Step4Impacto({ form, setField, errors }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.sectionTitle}>Impacto sostenible y archivos</Text>

      {/* Reduce empaques */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>¿Reduces o eliminas empaques plásticos? <Text style={s.req}>*</Text></Text>
        <View style={s.reduceRow}>
          {REDUCE_OPTIONS.map(({ value, label, icon }) => (
            <Pressable
              key={value}
              style={[s.reduceCard, form.reduce_empaques === value && s.reduceCardActive]}
              onPress={() => setField('reduce_empaques', value)}
            >
              <Ionicons
                name={icon}
                size={20}
                color={form.reduce_empaques === value ? '#22c55e' : '#6b7280'}
              />
              <Text style={[s.reduceLabel, form.reduce_empaques === value && s.reduceLabelActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.reduce_empaques ? <Text style={s.error}>{errors.reduce_empaques}</Text> : null}
      </View>

      {/* Actividades sostenibles */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Actividades sostenibles <Text style={s.optional}>(opcional)</Text></Text>
        <TextInput
          style={s.textarea}
          placeholder="Ej. Usamos materiales reciclados, compostamos residuos orgánicos..."
          placeholderTextColor="#6b7280"
          value={form.actividades_sostenibles}
          onChangeText={(v) => setField('actividades_sostenibles', v)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Resuelve problemática ambiental */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>¿Cómo resuelves una problemática ambiental? <Text style={s.optional}>(opcional)</Text></Text>
        <TextInput
          style={s.textarea}
          placeholder="Ej. Reducimos residuos textiles mediante la reutilización de telas..."
          placeholderTextColor="#6b7280"
          value={form.resuelve_problematica_ambiental}
          onChangeText={(v) => setField('resuelve_problematica_ambiental', v)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Foto principal */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>URL de foto de portada <Text style={s.req}>*</Text></Text>
        <TextInput
          style={[s.input, errors.foto_principal_url && s.inputError]}
          placeholder="https://drive.google.com/..."
          placeholderTextColor="#6b7280"
          value={form.foto_principal_url}
          onChangeText={(v) => setField('foto_principal_url', v)}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={s.helper}>Sube la imagen a Google Drive u otro servicio y pega el enlace aquí.</Text>
        {errors.foto_principal_url ? <Text style={s.error}>{errors.foto_principal_url}</Text> : null}
      </View>

      {/* Catálogo PDF */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>URL del catálogo PDF <Text style={s.optional}>(opcional)</Text></Text>
        <TextInput
          style={[s.input, errors.catalogo_pdf_url && s.inputError]}
          placeholder="https://drive.google.com/..."
          placeholderTextColor="#6b7280"
          value={form.catalogo_pdf_url}
          onChangeText={(v) => setField('catalogo_pdf_url', v)}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.catalogo_pdf_url ? <Text style={s.error}>{errors.catalogo_pdf_url}</Text> : null}
      </View>
    </View>
  );
}

const PRIMARY    = '#22c55e';
const SURFACE_IN = '#21262d';
const BORDER     = '#30363d';
const TEXT_W     = '#ffffff';
const TEXT_S     = '#9ca3af';
const TEXT_M     = '#6b7280';
const RED        = '#ef4444';

const s = StyleSheet.create({
  wrap:            { gap: 20 },
  sectionTitle:    { fontSize: 17, fontWeight: '700', color: TEXT_W, marginBottom: 4 },
  fieldWrap:       { gap: 6 },
  label:           { fontSize: 13, fontWeight: '600', color: TEXT_S },
  req:             { color: RED },
  optional:        { color: TEXT_M, fontWeight: '400' },
  input:           { backgroundColor: SURFACE_IN, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: TEXT_W },
  inputError:      { borderColor: RED },
  textarea:        { backgroundColor: SURFACE_IN, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: TEXT_W, minHeight: 90 },
  helper:          { fontSize: 11, color: TEXT_M, lineHeight: 16 },
  error:           { fontSize: 12, color: RED },

  reduceRow:       { flexDirection: 'row', gap: 8 },
  reduceCard:      { flex: 1, backgroundColor: SURFACE_IN, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 6, gap: 5 },
  reduceCardActive:{ borderColor: PRIMARY, backgroundColor: 'rgba(34,197,94,0.08)' },
  reduceLabel:     { fontSize: 11, fontWeight: '500', color: TEXT_M, textAlign: 'center' },
  reduceLabelActive:{ color: PRIMARY, fontWeight: '600' },
});
