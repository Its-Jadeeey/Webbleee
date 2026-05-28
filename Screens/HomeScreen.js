import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { useAuth } from '../Context/AuthContext';
import { useTask } from '../Context/TaskContext';
import { useTheme } from '../Context/ThemeContext';
import SideDrawer from '../Components/SideDrawer';

const PRIORITY_COLOR = { High: '#EF4444', Medium: '#F59E0B', Low: '#3B82F6' };
const CATEGORY_COLOR = { Work: '#E0F2FE', Meeting: '#F3E8FF', Admin: '#FEF9C3', Personal: '#DCFCE7', Other: '#F1F5F9' };
const CATEGORY_TEXT  = { Work: '#0369A1', Meeting: '#7C3AED', Admin: '#92400E', Personal: '#166534', Other: '#475569' };

export default function HomeScreen({ setView, setSelectedTaskId }) {
  const { user } = useAuth();
  const { tasks, createTask, updateTaskItem } = useTask();
  const { theme: t } = useTheme();

  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle,     setNewTitle]     = useState('');
  const [newDueDate,   setNewDueDate]   = useState('');
  const [priority,     setPriority]     = useState('Medium');
  const [category,     setCategory]     = useState('Work');

  const completed  = tasks.filter((t) => t.status === 'completed').length;
  const remaining  = tasks.length - completed;
  const percent    = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createTask(newTitle.trim(), priority, category, newDueDate.trim());
    setNewTitle(''); setNewDueDate('');
    setModalVisible(false);
    setPriority('Medium'); setCategory('Work');
  };

  const todayTasks    = tasks.slice(0, 3);
  const upcomingTasks = tasks.slice(3);

  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const getUpcomingLabel = (index) => {
    const d = new Date(); d.setDate(d.getDate() + index + 1);
    return `${DAYS[d.getDay()]} ${d.getDate()}`;
  };

  return (
    <View style={[s.container, { backgroundColor: t.bg }]}>
      {/* TOP NAV */}
      <View style={[s.topNav, { backgroundColor: t.navBg, borderBottomColor: t.border }]}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} hitSlop={{ top:10, bottom:10, left:10, right:10 }}>
          <Text style={[s.menuIcon, { color: t.text }]}>☰</Text>
        </TouchableOpacity>
        <Text style={s.brandName}>TASK TRACKER</Text>
        <View style={s.avatarSmall}>
          <Text style={s.avatarSmallText}>{user?.displayName?.[0]?.toUpperCase() || 'U'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* GREETING */}
        <View style={s.greetSection}>
          <Text style={[s.greetLine, { color: t.text }]}>Good morning, {user?.displayName?.split(' ')[0] || 'there'}</Text>
          <Text style={[s.greetSub,  { color: t.textSub }]}>Your day is looking clear. You have {remaining} task{remaining !== 1 ? 's' : ''} remaining for today.</Text>
        </View>

        {/* DAILY PROGRESS */}
        <View style={[s.progressCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={s.progressLeft}>
            <Text style={s.progressLabel}>Daily Progress</Text>
            <Text style={[s.progressCount, { color: t.text }]}>{completed}/{tasks.length} tasks completed</Text>
          </View>
          <View style={s.circleWrap}>
            <View style={[s.circleBg, { borderColor: t.border }]} />
            <View style={s.circleArc} />
            <Text style={s.circlePercent}>{percent}%</Text>
          </View>
        </View>

        {/* TODAY */}
        <View style={s.sectionRow}>
          <Text style={[s.sectionTitle, { color: t.text }]}>Today</Text>
          <TouchableOpacity onPress={() => setView('TASKS')}>
            <Text style={s.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {todayTasks.length === 0
          ? <Text style={[s.emptyText, { color: t.textMuted }]}>No tasks yet. Tap + to add one.</Text>
          : todayTasks.map((task) => {
              const isCompleted = task.status === 'completed';
              const pColor = PRIORITY_COLOR[task.priority] || '#64748B';
              const catBg  = CATEGORY_COLOR[task.category] || '#F1F5F9';
              const catTxt = CATEGORY_TEXT[task.category]  || '#475569';
              return (
                <TouchableOpacity
                  key={task.id}
                  style={[s.taskRow, { backgroundColor: t.card, borderColor: t.border }, isCompleted && s.taskRowDone]}
                  onPress={() => { setSelectedTaskId(task.id); setView('TASK_DETAIL'); }}
                  activeOpacity={0.7}
                >
                  <View style={s.taskLeft}>
                    <TouchableOpacity
                      style={[s.taskCheck, isCompleted && s.taskCheckDone]}
                      onPress={() => updateTaskItem(task.id, { status: isCompleted ? 'pending' : 'completed' })}
                    />
                  </View>
                  <View style={s.taskBody}>
                    <Text style={[s.taskTitle, { color: t.text }, isCompleted && s.taskTitleDone]}>{task.title}</Text>
                    {task.dueDate ? <Text style={[s.taskDue, { color: t.textMuted }]}>Due at {task.dueDate}</Text> : null}
                    <View style={s.tagRow}>
                      <View style={[s.tag, { backgroundColor: catBg }]}>
                        <Text style={[s.tagText, { color: catTxt }]}>{task.category || 'Work'}</Text>
                      </View>
                      <View style={[s.tag, { backgroundColor: pColor + '18' }]}>
                        <Text style={[s.tagText, { color: pColor }]}>{task.priority} Priority</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[s.taskChevron, { color: t.border }]}>›</Text>
                </TouchableOpacity>
              );
            })
        }

        {/* UPCOMING */}
        {upcomingTasks.length > 0 && (
          <>
            <Text style={[s.sectionTitle, { color: t.text, marginTop: 24, marginBottom: 8, paddingHorizontal: 20 }]}>Upcoming</Text>
            {upcomingTasks.map((task, i) => (
              <TouchableOpacity
                key={task.id}
                style={[s.upcomingRow, { backgroundColor: t.card, borderColor: t.border }]}
                onPress={() => { setSelectedTaskId(task.id); setView('TASK_DETAIL'); }}
                activeOpacity={0.7}
              >
                <View style={s.upcomingDate}>
                  <Text style={[s.upcomingDay, { color: t.textMuted }]}>{getUpcomingLabel(i).split(' ')[0]}</Text>
                  <Text style={[s.upcomingNum, { color: t.text }]}>{getUpcomingLabel(i).split(' ')[1]}</Text>
                </View>
                <Text style={[s.upcomingTitle, { color: t.text }]}>{task.title}</Text>
                <Text style={[s.taskChevron, { color: t.border }]}>›</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => setModalVisible(true)}>
        <Text style={s.fabIcon}>+</Text>
      </TouchableOpacity>

      <SideDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} currentView="HOME" setView={setView} />

      {/* ADD TASK MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={[s.sheet, { backgroundColor: t.card }]}>
            <View style={[s.sheetHandle, { backgroundColor: t.border }]} />
            <Text style={[s.sheetTitle, { color: t.text }]}>New Task</Text>

            <Text style={[s.fieldLabel, { color: t.textSub }]}>Title</Text>
            <TextInput style={[s.input, { backgroundColor: t.inputBg, borderColor: t.border, color: t.text }]}
              placeholder="Task title..." placeholderTextColor={t.textMuted}
              value={newTitle} onChangeText={setNewTitle} />

            <Text style={[s.fieldLabel, { color: t.textSub }]}>Due Date</Text>
            <TextInput style={[s.input, { backgroundColor: t.inputBg, borderColor: t.border, color: t.text }]}
              placeholder="e.g. 10:30 AM or Oct 24" placeholderTextColor={t.textMuted}
              value={newDueDate} onChangeText={setNewDueDate} />

            <Text style={[s.fieldLabel, { color: t.textSub }]}>Priority</Text>
            <View style={s.chipRow}>
              {['Low','Medium','High'].map((p) => (
                <TouchableOpacity key={p} onPress={() => setPriority(p)}
                  style={[s.chip, { backgroundColor: t.chipBg, borderColor: t.border },
                    priority === p && { backgroundColor: PRIORITY_COLOR[p]+'18', borderColor: PRIORITY_COLOR[p] }]}>
                  <Text style={[s.chipText, { color: t.textSub }, priority === p && { color: PRIORITY_COLOR[p], fontWeight:'700' }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[s.fieldLabel, { color: t.textSub }]}>Category</Text>
            <View style={s.chipRow}>
              {['Work','Meeting','Admin','Personal'].map((c) => (
                <TouchableOpacity key={c} onPress={() => setCategory(c)}
                  style={[s.chip, { backgroundColor: t.chipBg, borderColor: t.border },
                    category === c && { backgroundColor: '#E0F2F1', borderColor: '#00796B' }]}>
                  <Text style={[s.chipText, { color: t.textSub }, category === c && { color: '#00796B', fontWeight:'700' }]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity onPress={handleCreate} style={s.createBtn}>
              <Text style={s.createBtnText}>Create Task</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={s.cancelBtn}>
              <Text style={[s.cancelBtnText, { color: t.textMuted }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container:     { flex: 1 },
  topNav:        { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:16, paddingBottom:12, borderBottomWidth:1 },
  menuIcon:      { fontSize:18 },
  brandName:     { fontSize:13, fontWeight:'900', color:'#00796B', letterSpacing:1.5 },
  avatarSmall:   { width:32, height:32, borderRadius:16, backgroundColor:'#00796B', justifyContent:'center', alignItems:'center' },
  avatarSmallText:{ color:'#fff', fontWeight:'800', fontSize:13 },
  greetSection:  { paddingHorizontal:20, paddingTop:20, paddingBottom:4 },
  greetLine:     { fontSize:22, fontWeight:'800' },
  greetSub:      { fontSize:13, marginTop:4, lineHeight:20 },
  progressCard:  { marginHorizontal:20, marginTop:16, marginBottom:8, borderRadius:16, padding:18, flexDirection:'row', alignItems:'center', justifyContent:'space-between', borderWidth:1 },
  progressLeft:  { flex:1 },
  progressLabel: { fontSize:11, fontWeight:'700', color:'#00796B', textTransform:'uppercase', letterSpacing:0.5 },
  progressCount: { fontSize:15, fontWeight:'700', marginTop:4 },
  circleWrap:    { width:52, height:52, justifyContent:'center', alignItems:'center' },
  circleBg:      { position:'absolute', width:48, height:48, borderRadius:24, borderWidth:4 },
  circleArc:     { position:'absolute', width:48, height:48, borderRadius:24, borderWidth:4, borderColor:'#00796B', borderRightColor:'transparent', borderBottomColor:'transparent', transform:[{rotate:'-90deg'}] },
  circlePercent: { fontSize:12, fontWeight:'800', color:'#00796B' },
  sectionRow:    { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, marginTop:24, marginBottom:10 },
  sectionTitle:  { fontSize:16, fontWeight:'800' },
  viewAll:       { fontSize:13, color:'#00796B', fontWeight:'600' },
  emptyText:     { paddingHorizontal:20, fontSize:14 },
  taskRow:       { flexDirection:'row', alignItems:'flex-start', marginHorizontal:20, marginBottom:10, borderRadius:14, borderWidth:1, padding:14 },
  taskRowDone:   { opacity:0.6 },
  taskLeft:      { alignItems:'center', marginRight:12, paddingTop:2 },
  taskCheck:     { width:18, height:18, borderRadius:9, borderWidth:2, borderColor:'#CBD5E1' },
  taskCheckDone: { backgroundColor:'#00796B', borderColor:'#00796B' },
  taskBody:      { flex:1 },
  taskTitle:     { fontSize:14, fontWeight:'600' },
  taskTitleDone: { textDecorationLine:'line-through', color:'#94A3B8' },
  taskDue:       { fontSize:12, marginTop:3 },
  tagRow:        { flexDirection:'row', gap:6, marginTop:8, flexWrap:'wrap' },
  tag:           { paddingHorizontal:8, paddingVertical:3, borderRadius:20 },
  tagText:       { fontSize:11, fontWeight:'600' },
  taskChevron:   { fontSize:20, alignSelf:'center', marginLeft:4 },
  upcomingRow:   { flexDirection:'row', alignItems:'center', marginHorizontal:20, marginBottom:8, borderRadius:14, borderWidth:1, paddingVertical:14, paddingHorizontal:16 },
  upcomingDate:  { width:40, marginRight:14 },
  upcomingDay:   { fontSize:11, fontWeight:'600', textTransform:'uppercase' },
  upcomingNum:   { fontSize:16, fontWeight:'800' },
  upcomingTitle: { flex:1, fontSize:14, fontWeight:'500' },
  fab:           { position:'absolute', bottom:24, right:24, width:52, height:52, borderRadius:26, backgroundColor:'#00796B', justifyContent:'center', alignItems:'center', shadowColor:'#00796B', shadowOffset:{width:0,height:4}, shadowOpacity:0.35, shadowRadius:10 },
  fabIcon:       { color:'#fff', fontSize:26, lineHeight:28 },
  overlay:       { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'flex-end' },
  sheet:         { padding:24, borderTopLeftRadius:24, borderTopRightRadius:24 },
  sheetHandle:   { width:40, height:4, borderRadius:2, alignSelf:'center', marginBottom:16 },
  sheetTitle:    { fontSize:18, fontWeight:'800', marginBottom:16 },
  fieldLabel:    { fontSize:11, fontWeight:'700', textTransform:'uppercase', letterSpacing:0.5, marginBottom:6, marginTop:12 },
  input:         { height:46, borderWidth:1, borderRadius:12, paddingHorizontal:14, fontSize:14 },
  chipRow:       { flexDirection:'row', gap:8, flexWrap:'wrap' },
  chip:          { paddingHorizontal:14, paddingVertical:7, borderRadius:20, borderWidth:1 },
  chipText:      { fontSize:12, fontWeight:'600' },
  createBtn:     { backgroundColor:'#00796B', height:50, borderRadius:14, justifyContent:'center', alignItems:'center', marginTop:20 },
  createBtnText: { color:'#fff', fontWeight:'800', fontSize:15 },
  cancelBtn:     { alignItems:'center', marginTop:12, paddingVertical:8 },
  cancelBtnText: { fontWeight:'600', fontSize:14 },
});