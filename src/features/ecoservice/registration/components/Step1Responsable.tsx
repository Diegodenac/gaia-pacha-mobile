import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import type { RegistrationForm } from '../types';

const EDAD_OPTIONS = ['18–25', '26–35', '36–45', '46–55', '55+'];

interface Props {
  form: RegistrationForm;
  setField: (key: keyof RegistrationForm, value: string) => void;
  errors: Record<string, string>;
}

export function Step1Responsable({ form, setField, errors }: Props) {
  return (
    <View style={s.wrap}>
      <Text style={s.sectionTitle}>¿Quién está detrás del emprendimiento?</Text>

      {/* Nombre */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Tu nombre completo <Text style={s.req}>*</Text></Text>
        <TextInput
          style={[s.input, errors.nombre_entrepreneur && s.inputError]}
          placeholder="Ej. María Condori"
          placeholderTextColor="#6b7280"
          value={form.nombre_entrepreneur}
          onChangeText={(v) => setField('nombre_entrepreneur', v)}
          autoCapitalize="words"
          returnKeyType="next"
        />
        {errors.nombre_entrepreneur ? (
          <Text style={s.error}>{errors.nombre_entrepreneur}</Text>
        ) : null}
      </View>

      {/* Edad */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Rango de edad <Text style={s.optional}>(opcional)</Text></Text>
        <View style={s.chipRow}>
          {EDAD_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={[s.chip, form.edad_emprendedor === opt && s.chipActive]}
              onPress={() => setField('edad_emprendedor', form.edad_emprendedor === opt ? '' : opt)}
            >
              <Text style={[s.chipText, form.edad_emprendedor === opt && s.chipTextActive]}>
                {opt}
              </Text>
            </Pressable>
          ))}
        </View>
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
  error:         { fontSize: 12, color: RED },
  chipRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:          { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: BORDER, backgroundColor: SURFACE_IN },
  chipActive:    { borderColor: PRIMARY, backgroundColor: 'rgba(34,197,94,0.12)' },
  chipText:      { fontSize: 13, fontWeight: '500', color: TEXT_S },
  chipTextActive:{ color: PRIMARY, fontWeight: '600' },
});
