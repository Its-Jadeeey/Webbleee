import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TaskCard({ task, onToggle, onPress }) {
  const isCompleted = task.status === 'completed';
  const pColor = task.priority === 'High' ? '#EF4444' : task.priority === 'Medium' ? '#F59E0B' : '#3B82F6';

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={[styles.checkbox, isCompleted && styles.checked]} 
        onPress={() => onToggle(task.id, isCompleted ? 'pending' : 'completed')}
      >
        {isCompleted && <Text style={styles.checkIcon}>✓</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.info} onPress={() => onPress(task.id)}>
        <Text style={[styles.title, isCompleted && styles.lineThrough]}>{task.title}</Text>
        <View style={styles.tagRow}>
          <View style={styles.chip}><Text style={styles.chipText}>{task.category || 'Work'}</Text></View>
          <View style={[styles.chip, { backgroundColor: pColor + '15' }]}>
            <Text style={[styles.chipText, { color: pColor }]}>{task.priority} Priority</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
  backgroundColor: '#FFFFFF',
  padding: 16,
  borderRadius: 16,
  flexDirection: 'row',
  alignItems: 'flex-start',
  borderWidth: 1,
  borderColor: '#E2E8F0',
  marginBottom: 12,

  boxShadow: '0px 2px 4px rgba(15,23,42,0.05)',
},
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  checked: { backgroundColor: '#00796B', borderColor: '#00796B' },
  checkIcon: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  info: { flex: 1, marginLeft: 14 },
  title: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  lineThrough: { textDecorationLine: 'line-through', color: '#94A3B8' },
  tagRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  chip: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  chipText: { fontSize: 11, fontWeight: '600', color: '#64748B' }
});