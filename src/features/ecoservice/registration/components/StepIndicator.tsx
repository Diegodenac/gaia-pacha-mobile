import { View, Text, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  total: number;
  current: number;
  label: string;
}

export function StepIndicator({ total, current, label }: StepIndicatorProps) {
  const progress = ((current + 1) / total) * 100;

  return (
    <View style={s.wrap}>
      <View style={s.trackRow}>
        <View style={s.track}>
          <View style={[s.fill, { width: `${progress}%` }]} />
        </View>
        <Text style={s.counter}>{current + 1}/{total}</Text>
      </View>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:      { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  trackRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  track:     { flex: 1, height: 4, backgroundColor: '#30363d', borderRadius: 2, overflow: 'hidden' },
  fill:      { height: '100%', backgroundColor: '#22c55e', borderRadius: 2 },
  counter:   { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  label:     { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
});
