import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import type { RegistrationForm } from '../types';

const TIEMPO_OPTIONS = ['Menos de 1 año', '1–3 años', '3–5 años', 'Más de 5 años'];

interface Props {
  form: RegistrationForm;
  setField: (key: keyof RegistrationForm, value: string) => void;
  errors: Record<string, string>;
}

export function Step2Identidad({ form, setField, errors }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.sectionTitle}>Cuéntanos sobre tu emprendimiento</Text>

      {/* Nombre del emprendimiento */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Nombre del emprendimiento <Text style={s.req}>*</Text></Text>
        <TextInput
          style={[s.input, errors.nombre_emprendimiento && s.inputError]}
          placeholder="Ej. EcoVerde Bolivia"
          placeholderTextColor="#6b7280"
          value={form.nombre_emprendimiento}
          onChangeText={(v) => setField('nombre_emprendimiento', v)}
          autoCapitalize="words"
          returnKeyType="next"
        />
        {errors.nombre_emprendimiento ? (
          <Text style={s.error}>{errors.nombre_emprendimiento}</Text>
        ) : null}
      </View>

      {/* Celular */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Celular de ventas (WhatsApp) <Text style={s.req}>*</Text></Text>
        <View style={[s.phoneRow, errors.celular_ventas && s.inputError]}>
          <Text style={s.prefix}>+591</Text>
          <TextInput
            style={s.phoneInput}
            placeholder="71234567"
            placeholderTextColor="#6b7280"
            value={form.celular_ventas}
            onChangeText={(v) => setField('celular_ventas', v.replace(/\D/g, ''))}
            keyboardType="phone-pad"
            maxLength={8}
            returnKeyType="next"
          />
        </View>
        {errors.celular_ventas ? (
          <Text style={s.error}>{errors.celular_ventas}</Text>
        ) : null}
      </View>

      {/* Tiempo en el mercado */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Tiempo en el mercado <Text style={s.optional}>(opcional)</Text></Text>
        <View style={s.chipRow}>
          {TIEMPO_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={[s.chip, form.tiempo_mercado === opt && s.chipActive]}
              onPress={() => setField('tiempo_mercado', form.tiempo_mercado === opt ? '' : opt)}
            >
              <Text style={[s.chipText, form.tiempo_mercado === opt && s.chipTextActive]}>
                {opt}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Descripción */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Descripción del negocio <Text style={s.req}>*</Text></Text>
        <TextInput
          style={[s.textarea, errors.descripcion_detallada && s.inputError]}
          placeholder="Describe qué ofreces, qué te diferencia y cómo impactas al medio ambiente..."
          placeholderTextColor="#6b7280"
          value={form.descripcion_detallada}
          onChangeText={(v) => setField('descripcion_detallada', v)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          returnKeyType="default"
        />
        <Text style={s.counter}>{form.descripcion_detallada.length} / min. 20</Text>
        {errors.descripcion_detallada ? (
          <Text style={s.error}>{errors.descripcion_detallada}</Text>
        ) : null}
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
  wrap:          { gap: 20 },
  sectionTitle:  { fontSize: 17, fontWeight: '700', color: TEXT_W, marginBottom: 4 },
  fieldWrap:     { gap: 6 },
  label:         { fontSize: 13, fontWeight: '600', color: TEXT_S },
  req:           { color: RED },
  optional:      { color: TEXT_M, fontWeight: '400' },
  input:         { backgroundColor: SURFACE_IN, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: TEXT_W },
  inputError:    { borderColor: RED },
  phoneRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: SURFACE_IN, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingLeft: 14 },
  prefix:        { fontSize: 15, fontWeight: '600', color: TEXT_S, marginRight: 4 },
  phoneInput:    { flex: 1, paddingHorizontal: 8, paddingVertical: 13, fontSize: 15, color: TEXT_W },
  textarea:      { backgroundColor: SURFACE_IN, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: TEXT_W, minHeight: 110 },
  counter:       { fontSize: 11, color: TEXT_M, textAlign: 'right' },
  chipRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:          { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: BORDER, backgroundColor: SURFACE_IN },
  chipActive:    { borderColor: PRIMARY, backgroundColor: 'rgba(34,197,94,0.12)' },
  chipText:      { fontSize: 13, fontWeight: '500', color: TEXT_S },
  chipTextActive:{ color: PRIMARY, fontWeight: '600' },
  error:         { fontSize: 12, color: RED },
});
