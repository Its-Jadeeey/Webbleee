import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTask } from '../Context/TaskContext';
import { useTheme } from '../Context/ThemeContext';
import TaskCard from '../Components/TaskCard';

const FILTERS = ['All', 'Pending', 'Completed'];

export default function TasksListScreen({ setView, setSelectedTaskId }) {
  const { tasks, updateTaskItem } = useTask();
  const { theme: t } = useTheme();
  const [filter, setFilter] = useState('All');

  const filtered = tasks.filter((task) => {
    if (filter === 'Pending')   return task.status === 'pending';
    if (filter === 'Completed') return task.status === 'completed';
    return true;
  });

  return (
    <View style={[s.container, { backgroundColor: t.bg }]}>
      <View style={[s.header, { borderBottomColor: t.border }]}>
        <Text style={[s.title, { color: t.text }]}>All Tasks</Text>
        <Text style={[s.count, { color: t.textMuted }]}>{tasks.length} total</Text>
      </View>

      <View style={s.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={[s.chip, { backgroundColor: t.chipBg, borderColor: t.border },
              filter === f && { backgroundColor: '#E0F2F1', borderColor: '#00796B' }]}>
            <Text style={[s.chipText, { color: t.textSub }, filter === f && { color: '#00796B', fontWeight: '700' }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>📭</Text>
            <Text style={[s.emptyText, { color: t.textMuted }]}>No {filter.toLowerCase()} tasks yet.</Text>
          </View>
        ) : (
          filtered.map((task) => (
            <TaskCard key={task.id} task={task}
              onToggle={(id, status) => updateTaskItem(id, { status })}
              onPress={(id) => { setSelectedTaskId(id); setView('TASK_DETAIL'); }} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:  { flex:1 },
  header:     { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, paddingTop:20, paddingBottom:12, borderBottomWidth:1 },
  title:      { fontSize:22, fontWeight:'800' },
  count:      { fontSize:13, fontWeight:'600' },
  filterRow:  { flexDirection:'row', paddingHorizontal:20, gap:8, paddingVertical:12 },
  chip:       { paddingHorizontal:14, paddingVertical:7, borderRadius:20, borderWidth:1 },
  chipText:   { fontSize:12, fontWeight:'600' },
  empty:      { alignItems:'center', marginTop:60 },
  emptyIcon:  { fontSize:40, marginBottom:12 },
  emptyText:  { fontSize:15, fontWeight:'500' },
});