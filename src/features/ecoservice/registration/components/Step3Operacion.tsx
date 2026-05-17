import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { RegistrationForm, HorarioForm, DayKey } from '../types';
import { DAYS, DAY_LABEL } from '../types';

interface Props {
  form: RegistrationForm;
  setField: (key: keyof RegistrationForm, value: any) => void;
  errors: Record<string, string>;
}

export function Step3Operacion({ form, setField, errors }: Props) {
  function toggleDay(day: DayKey) {
    const next: HorarioForm = {
      ...form.horario,
      [day]: { ...form.horario[day], active: !form.horario[day].active },
    };
    setField('horario', next);
  }

  function setTime(day: DayKey, field: 'from' | 'to', value: string) {
    const next: HorarioForm = {
      ...form.horario,
      [day]: { ...form.horario[day], [field]: value },
    };
    setField('horario', next);
  }

  const activeDays = DAYS.filter(d => form.horario[d].active);

  return (
    <View style={s.wrap}>
      <Text style={s.sectionTitle}>Operación y presencia digital</Text>

      {/* Tipo de ubicación */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Tipo de ubicación <Text style={s.req}>*</Text></Text>
        <View style={s.locRow}>
          {([
            { value: 'fisica',   label: 'Tienda física',           icon: 'storefront-outline' as const },
            { value: 'virtual',  label: 'Solo negocio virtual',     icon: 'globe-outline' as const },
          ] as const).map(({ value, label, icon }) => (
            <Pressable
              key={value}
              style={[s.locCard, form.tipo_ubicacion === value && s.locCardActive]}
              onPress={() => setField('tipo_ubicacion', value)}
            >
              <Ionicons
                name={icon}
                size={22}
                color={form.tipo_ubicacion === value ? '#22c55e' : '#6b7280'}
              />
              <Text style={[s.locLabel, form.tipo_ubicacion === value && s.locLabelActive]}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.tipo_ubicacion ? <Text style={s.error}>{errors.tipo_ubicacion}</Text> : null}

        {/* Privacy notice */}
        {form.tipo_ubicacion === 'fisica' && (
          <View style={s.privacyBanner}>
            <Ionicons name="information-circle-outline" size={16} color="#f59e0b" />
            <Text style={s.privacyText}>
              Si usarás tu domicilio personal como ubicación, te recomendamos seleccionar
              "Solo negocio virtual" para proteger tus datos personales.
            </Text>
          </View>
        )}
      </View>

      {/* Google Maps — conditional */}
      {form.tipo_ubicacion === 'fisica' && (
        <View style={s.fieldWrap}>
          <Text style={s.label}>Enlace de Google Maps <Text style={s.req}>*</Text></Text>
          <TextInput
            style={[s.input, errors.link_google_maps && s.inputError]}
            placeholder="https://maps.google.com/?q=..."
            placeholderTextColor="#6b7280"
            value={form.link_google_maps}
            onChangeText={(v) => setField('link_google_maps', v)}
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.link_google_maps ? <Text style={s.error}>{errors.link_google_maps}</Text> : null}
        </View>
      )}

      {/* Horario */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Horario de atención</Text>
        <View style={s.dayChips}>
          {DAYS.map((day) => (
            <Pressable
              key={day}
              style={[s.dayChip, form.horario[day].active && s.dayChipActive]}
              onPress={() => toggleDay(day)}
            >
              <Text style={[s.dayChipText, form.horario[day].active && s.dayChipTextActive]}>
                {DAY_LABEL[day]}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.horario ? <Text style={s.error}>{errors.horario}</Text> : null}

        {activeDays.length > 0 && (
          <View style={s.timeRows}>
            {activeDays.map((day) => (
              <View key={day} style={s.timeRow}>
                <Text style={s.dayName}>{DAY_LABEL[day]}</Text>
                <TextInput
                  style={s.timeInput}
                  value={form.horario[day].from}
                  onChangeText={(v) => setTime(day, 'from', v)}
                  placeholder="08:00"
                  placeholderTextColor="#6b7280"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
                <Text style={s.timeSep}>–</Text>
                <TextInput
                  style={s.timeInput}
                  value={form.horario[day].to}
                  onChangeText={(v) => setTime(day, 'to', v)}
                  placeholder="18:00"
                  placeholderTextColor="#6b7280"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                />
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Redes sociales */}
      <View style={s.fieldWrap}>
        <Text style={s.label}>Redes sociales <Text style={s.optional}>(opcional)</Text></Text>
        {([
          { key: 'red_fb', icon: 'logo-facebook', placeholder: 'facebook.com/tu-pagina' },
          { key: 'red_ig', icon: 'logo-instagram', placeholder: 'instagram.com/tu-cuenta' },
          { key: 'red_tt', icon: 'logo-tiktok',    placeholder: 'tiktok.com/@tu-cuenta' },
        ] as const).map(({ key, icon, placeholder }) => (
          <View key={key} style={s.socialRow}>
            <Ionicons name={icon as any} size={18} color="#6b7280" style={s.socialIcon} />
            <TextInput
              style={s.socialInput}
              placeholder={placeholder}
              placeholderTextColor="#6b7280"
              value={form[key]}
              onChangeText={(v) => setField(key, v)}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        ))}
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
const WARN       = '#f59e0b';

const s = StyleSheet.create({
  wrap:           { gap: 20 },
  sectionTitle:   { fontSize: 17, fontWeight: '700', color: TEXT_W, marginBottom: 4 },
  fieldWrap:      { gap: 8 },
  label:          { fontSize: 13, fontWeight: '600', color: TEXT_S },
  req:            { color: RED },
  optional:       { color: TEXT_M, fontWeight: '400' },
  input:          { backgroundColor: SURFACE_IN, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: TEXT_W },
  inputError:     { borderColor: RED },
  error:          { fontSize: 12, color: RED },

  locRow:         { flexDirection: 'row', gap: 10 },
  locCard:        { flex: 1, backgroundColor: SURFACE_IN, borderWidth: 1.5, borderColor: BORDER, borderRadius: 14, alignItems: 'center', paddingVertical: 14, gap: 6 },
  locCardActive:  { borderColor: PRIMARY, backgroundColor: 'rgba(34,197,94,0.08)' },
  locLabel:       { fontSize: 12, fontWeight: '500', color: TEXT_M, textAlign: 'center' },
  locLabelActive: { color: PRIMARY, fontWeight: '600' },

  privacyBanner:  { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(245,158,11,0.1)', borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)', borderRadius: 10, padding: 10 },
  privacyText:    { flex: 1, fontSize: 12, color: WARN, lineHeight: 17 },

  dayChips:       { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dayChip:        { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, borderWidth: 1.5, borderColor: BORDER, backgroundColor: SURFACE_IN },
  dayChipActive:  { borderColor: PRIMARY, backgroundColor: 'rgba(34,197,94,0.12)' },
  dayChipText:    { fontSize: 12, fontWeight: '500', color: TEXT_M },
  dayChipTextActive: { color: PRIMARY, fontWeight: '700' },

  timeRows:       { gap: 8, marginTop: 4 },
  timeRow:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dayName:        { width: 32, fontSize: 12, fontWeight: '600', color: TEXT_S },
  timeInput:      { flex: 1, backgroundColor: SURFACE_IN, borderWidth: 1, borderColor: BORDER, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: TEXT_W, textAlign: 'center' },
  timeSep:        { fontSize: 16, color: TEXT_M, fontWeight: '600' },

  socialRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: SURFACE_IN, borderWidth: 1, borderColor: BORDER, borderRadius: 12, paddingLeft: 14, marginBottom: 8 },
  socialIcon:     { marginRight: 4 },
  socialInput:    { flex: 1, paddingHorizontal: 10, paddingVertical: 13, fontSize: 14, color: TEXT_W },
});
