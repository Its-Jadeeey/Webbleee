import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useTask } from '../Context/TaskContext';
import { useTheme } from '../Context/ThemeContext';
import SideDrawer from '../Components/SideDrawer';

const PRIORITIES = ['Low', 'Medium', 'High'];
const CATEGORIES = ['Work', 'Meeting', 'Admin', 'Personal'];
const PCOLOR = { High: '#EF4444', Medium: '#F59E0B', Low: '#3B82F6' };

export default function TaskScreen({ setView, taskId }) {
  const { tasks, updateTaskItem, deleteTaskItem } = useTask();
  const { theme: t } = useTheme();

  const [subText,          setSubText]          = useState('');
  const [editingPriority,  setEditingPriority]  = useState(false);
  const [editingCategory,  setEditingCategory]  = useState(false);
  const [showDelete,       setShowDelete]       = useState(false);
  const [drawerOpen,       setDrawerOpen]       = useState(false);

  const task = tasks.find((item) => item.id === taskId);
  if (!task) return null;

  const subtasks  = task.subtasks || [];
  const doneCount = subtasks.filter((s) => s.completed).length;
  const pColor    = PCOLOR[task.priority] || '#64748B';

  const handleAddSub = async () => {
    if (!subText.trim()) return;
    const updated = [...subtasks, { id: Date.now().toString(), title: subText.trim(), completed: false }];
    await updateTaskItem(task.id, { subtasks: updated });
    setSubText('');
  };

  const handleToggleSub = async (subId) => {
    const updated = subtasks.map((s) => s.id === subId ? { ...s, completed: !s.completed } : s);
    await updateTaskItem(task.id, { subtasks: updated });
  };

  const handleDeleteSub = async (subId) => {
    await updateTaskItem(task.id, { subtasks: subtasks.filter((s) => s.id !== subId) });
  };

  const handleDelete = async () => {
    await deleteTaskItem(task.id);
    setView('HOME');
  };

  return (
    <View style={[s.container, { backgroundColor: t.bg }]}>
      {/* TOP NAV */}
      <View style={[s.topNav, { backgroundColor: t.navBg, borderBottomColor: t.border }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => setView('HOME')}>
          <Text style={[s.backArrow, { color: t.text }]}>←</Text>
          <Text style={s.brandName}>TASK TRACKER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.navIcon, { backgroundColor: t.inputBg }]} onPress={() => setDrawerOpen(true)}>
          <Text style={[s.navIconText, { color: t.textSub }]}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* PRIORITY + DATE */}
        <View style={s.metaRow}>
          <View style={[s.priorityBadge, { backgroundColor: pColor + '18' }]}>
            <Text style={[s.priorityText, { color: pColor }]}>{task.priority?.toUpperCase()} PRIORITY</Text>
          </View>
          {task.dueDate ? (
            <View style={s.dateBadge}>
              <Text style={s.dateIcon}>📅</Text>
              <Text style={[s.dateText, { color: t.textSub }]}>Due {task.dueDate}</Text>
            </View>
          ) : null}
        </View>

        {/* TITLE */}
        <Text style={[s.title, { color: t.text }]}>{task.title}</Text>

        {/* EDIT PRIORITY / CATEGORY */}
        <View style={[s.editCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <TouchableOpacity style={s.editRow}
            onPress={() => { setEditingPriority(!editingPriority); setEditingCategory(false); }}>
            <Text style={[s.editLabel, { color: t.textSub }]}>Priority</Text>
            <View style={s.editRight}>
              <Text style={[s.editValue, { color: pColor }]}>{task.priority}</Text>
              <Text style={[s.editChevron, { color: t.textMuted }]}>{editingPriority ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
          {editingPriority && (
            <View style={s.chipRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity key={p}
                  onPress={async () => { await updateTaskItem(task.id, { priority: p }); setEditingPriority(false); }}
                  style={[s.chip, { backgroundColor: t.chipBg, borderColor: t.border },
                    task.priority === p && { backgroundColor: PCOLOR[p]+'18', borderColor: PCOLOR[p] }]}>
                  <Text style={[s.chipText, { color: t.textSub }, task.priority === p && { color: PCOLOR[p] }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={[s.divider, { backgroundColor: t.border }]} />

          <TouchableOpacity style={s.editRow}
            onPress={() => { setEditingCategory(!editingCategory); setEditingPriority(false); }}>
            <Text style={[s.editLabel, { color: t.textSub }]}>Category</Text>
            <View style={s.editRight}>
              <Text style={[s.editValue, { color: t.text }]}>{task.category}</Text>
              <Text style={[s.editChevron, { color: t.textMuted }]}>{editingCategory ? '▲' : '▼'}</Text>
            </View>
          </TouchableOpacity>
          {editingCategory && (
            <View style={s.chipRow}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity key={c}
                  onPress={async () => { await updateTaskItem(task.id, { category: c }); setEditingCategory(false); }}
                  style={[s.chip, { backgroundColor: t.chipBg, borderColor: t.border },
                    task.category === c && { backgroundColor: '#E0F2F1', borderColor: '#00796B' }]}>
                  <Text style={[s.chipText, { color: t.textSub }, task.category === c && { color: '#00796B' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* SUBTASKS */}
        <View style={s.subtaskHeader}>
          <Text style={[s.subtaskTitle, { color: t.text }]}>Subtasks</Text>
          <View style={s.subtaskBadge}>
            <Text style={s.subtaskBadgeText}>{doneCount}/{subtasks.length} Done</Text>
          </View>
        </View>

        {subtasks.length === 0 && (
          <Text style={[s.emptyNote, { color: t.textMuted }]}>No subtasks yet. Add one below.</Text>
        )}

        {subtasks.map((sub) => (
          <TouchableOpacity key={sub.id} style={[s.subItem, { backgroundColor: t.card, borderColor: t.border }]}
            onPress={() => handleToggleSub(sub.id)} activeOpacity={0.7}>
            <View style={[s.subCheck, sub.completed && s.subCheckDone]}>
              {sub.completed && <Text style={s.subCheckIcon}>✓</Text>}
            </View>
            <Text style={[s.subText, { color: t.text }, sub.completed && s.subTextDone]}>{sub.title}</Text>
            <TouchableOpacity style={s.subDeleteBtn} onPress={() => handleDeleteSub(sub.id)}
              hitSlop={{ top:8, bottom:8, left:8, right:8 }}>
              <Text style={s.subDeleteIcon}>✕</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* ADD SUBTASK */}
        <View style={s.addRow}>
          <TextInput
            style={[s.addInput, { backgroundColor: t.card, borderColor: t.border, color: t.text }]}
            placeholder="+ Add Subtask"
            placeholderTextColor="#00796B"
            value={subText}
            onChangeText={setSubText}
            onSubmitEditing={handleAddSub}
            returnKeyType="done"
          />
          <TouchableOpacity style={[s.addBtn, { opacity: subText.length > 0 ? 1 : 0.4 }]} onPress={handleAddSub}>
            <Text style={s.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* DANGER ZONE */}
        <View style={s.dangerSection}>
          <Text style={[s.dangerLabel, { color: t.textMuted }]}>DANGER ZONE</Text>
          <TouchableOpacity style={[s.deleteBtn, { backgroundColor: t.dangerBg }]} onPress={() => setShowDelete(true)}>
            <Text style={s.deleteIcon}>🗑</Text>
            <Text style={s.deleteText}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SideDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} currentView="TASK_DETAIL" setView={setView} />

      {/* DELETE CONFIRM */}
      {showDelete && (
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { backgroundColor: t.card }]}>
            <Text style={[s.modalTitle, { color: t.text }]}>Delete Task?</Text>
            <Text style={[s.modalBody, { color: t.textSub }]}>"{task.title}" will be permanently removed.</Text>
            <View style={s.modalActions}>
              <TouchableOpacity style={[s.modalCancel, { borderColor: t.border }]} onPress={() => setShowDelete(false)}>
                <Text style={[s.modalCancelText, { color: t.textSub }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={handleDelete}>
                <Text style={s.modalConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container:       { flex:1 },
  topNav:          { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:16, paddingBottom:12, borderBottomWidth:1 },
  backBtn:         { flexDirection:'row', alignItems:'center', gap:8 },
  backArrow:       { fontSize:18 },
  brandName:       { fontSize:13, fontWeight:'900', color:'#00796B', letterSpacing:1.5 },
  navIcon:         { width:32, height:32, borderRadius:8, justifyContent:'center', alignItems:'center' },
  navIconText:     { fontSize:16 },
  metaRow:         { flexDirection:'row', alignItems:'center', gap:10, paddingHorizontal:20, paddingTop:20, flexWrap:'wrap' },
  priorityBadge:   { paddingHorizontal:10, paddingVertical:4, borderRadius:6 },
  priorityText:    { fontSize:10, fontWeight:'800', letterSpacing:0.8, textTransform:'uppercase' },
  dateBadge:       { flexDirection:'row', alignItems:'center', gap:4 },
  dateIcon:        { fontSize:12 },
  dateText:        { fontSize:12, fontWeight:'500' },
  title:           { fontSize:26, fontWeight:'800', paddingHorizontal:20, marginTop:10, marginBottom:6, lineHeight:34 },
  editCard:        { marginHorizontal:20, marginVertical:16, borderRadius:16, borderWidth:1, paddingVertical:4 },
  editRow:         { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:16, paddingVertical:14 },
  editLabel:       { fontSize:14, fontWeight:'500' },
  editRight:       { flexDirection:'row', alignItems:'center', gap:6 },
  editValue:       { fontSize:14, fontWeight:'700' },
  editChevron:     { fontSize:10 },
  divider:         { height:1, marginHorizontal:16 },
  chipRow:         { flexDirection:'row', gap:8, paddingHorizontal:16, paddingBottom:14, flexWrap:'wrap' },
  chip:            { paddingHorizontal:14, paddingVertical:7, borderRadius:20, borderWidth:1 },
  chipText:        { fontSize:12, fontWeight:'600' },
  subtaskHeader:   { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, marginBottom:10 },
  subtaskTitle:    { fontSize:16, fontWeight:'800' },
  subtaskBadge:    { backgroundColor:'#E0F2F1', paddingHorizontal:10, paddingVertical:4, borderRadius:20 },
  subtaskBadgeText:{ fontSize:11, fontWeight:'700', color:'#00796B' },
  emptyNote:       { fontSize:13, paddingHorizontal:20, marginBottom:12 },
  subItem:         { flexDirection:'row', alignItems:'center', marginHorizontal:20, marginBottom:8, borderRadius:12, borderWidth:1, padding:14, gap:12 },
  subCheck:        { width:22, height:22, borderRadius:11, borderWidth:2, borderColor:'#CBD5E1', justifyContent:'center', alignItems:'center', flexShrink:0 },
  subCheckDone:    { backgroundColor:'#00796B', borderColor:'#00796B' },
  subCheckIcon:    { color:'#fff', fontSize:12, fontWeight:'800' },
  subText:         { flex:1, fontSize:14, fontWeight:'500' },
  subTextDone:     { textDecorationLine:'line-through', color:'#94A3B8' },
  subDeleteBtn:    { width:26, height:26, borderRadius:8, backgroundColor:'#FEF2F2', justifyContent:'center', alignItems:'center' },
  subDeleteIcon:   { color:'#EF4444', fontSize:10, fontWeight:'800' },
  addRow:          { flexDirection:'row', alignItems:'center', marginHorizontal:20, marginTop:4, marginBottom:32, gap:8 },
  addInput:        { flex:1, height:46, borderWidth:1, borderRadius:12, paddingHorizontal:16, fontSize:14 },
  addBtn:          { backgroundColor:'#00796B', paddingHorizontal:16, height:46, borderRadius:12, justifyContent:'center', alignItems:'center' },
  addBtnText:      { color:'#fff', fontWeight:'700' },
  dangerSection:   { paddingHorizontal:20, marginTop:8 },
  dangerLabel:     { fontSize:10, fontWeight:'700', letterSpacing:1, textTransform:'uppercase', marginBottom:10 },
  deleteBtn:       { height:50, borderWidth:1, borderColor:'#FCA5A5', borderRadius:14, flexDirection:'row', justifyContent:'center', alignItems:'center', gap:8 },
  deleteIcon:      { fontSize:16 },
  deleteText:      { color:'#EF4444', fontWeight:'700', fontSize:15 },
  modalOverlay:    { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.5)', justifyContent:'center', alignItems:'center', padding:24 },
  modalBox:        { borderRadius:20, padding:24, width:'100%', maxWidth:380 },
  modalTitle:      { fontSize:18, fontWeight:'800', marginBottom:8 },
  modalBody:       { fontSize:14, lineHeight:22, marginBottom:24 },
  modalActions:    { flexDirection:'row', gap:10 },
  modalCancel:     { flex:1, height:46, borderRadius:12, borderWidth:1, justifyContent:'center', alignItems:'center' },
  modalCancelText: { fontWeight:'700' },
  modalConfirm:    { flex:1, height:46, borderRadius:12, backgroundColor:'#EF4444', justifyContent:'center', alignItems:'center' },
  modalConfirmText:{ color:'#fff', fontWeight:'700' },
});