import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';

const MENU_ITEMS = [
  { icon: '🏠', label: 'Home',    view: 'HOME'    },
  { icon: '☑',  label: 'Tasks',   view: 'TASKS'   },
  { icon: '👤', label: 'Profile', view: 'PROFILE' },
];

export default function SideDrawer({ visible, onClose, currentView, setView }) {
  const { user, logout } = useAuth();
  const { theme: t } = useTheme();

  if (!visible) return null;

  const handleNav = (view) => { setView(view); onClose(); };
  const handleLogout = async () => { onClose(); await logout(); };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity style={s.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[s.drawer, { backgroundColor: t.card }]}>
        <View style={[s.drawerHeader, { backgroundColor: t.bg }]}>
          <View style={s.drawerAvatar}>
            <Text style={s.drawerAvatarText}>{user?.displayName?.[0]?.toUpperCase() || 'U'}</Text>
          </View>
          <Text style={[s.drawerName,  { color: t.text }]}>{user?.displayName || 'User'}</Text>
          <Text style={[s.drawerEmail, { color: t.textSub }]}>{user?.email || ''}</Text>
        </View>

        <View style={[s.drawerDivider, { backgroundColor: t.border }]} />

        {MENU_ITEMS.map((item) => {
          const isActive = currentView === item.view;
          return (
            <TouchableOpacity key={item.view}
              style={[s.drawerItem, isActive && { backgroundColor: t.isDark ? '#0D2B22' : '#F0FDF9' }]}
              onPress={() => handleNav(item.view)} activeOpacity={0.7}>
              <Text style={s.drawerItemIcon}>{item.icon}</Text>
              <Text style={[s.drawerItemLabel, { color: isActive ? '#00796B' : t.textSub }, isActive && { fontWeight:'700' }]}>
                {item.label}
              </Text>
              {isActive && <View style={s.drawerActiveBar} />}
            </TouchableOpacity>
          );
        })}

        <View style={[s.drawerDivider, { backgroundColor: t.border }]} />

        <TouchableOpacity style={s.drawerLogout} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={s.drawerLogoutIcon}>↪</Text>
          <Text style={s.drawerLogoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop:        { position:'absolute', top:0, left:0, right:0, bottom:0, backgroundColor:'rgba(0,0,0,0.4)' },
  drawer:          { position:'absolute', top:0, left:0, bottom:0, width:280, shadowColor:'#000', shadowOffset:{width:4,height:0}, shadowOpacity:0.12, shadowRadius:20 },
  drawerHeader:    { paddingTop:48, paddingBottom:24, paddingHorizontal:24 },
  drawerAvatar:    { width:60, height:60, borderRadius:30, backgroundColor:'#00796B', justifyContent:'center', alignItems:'center', marginBottom:12 },
  drawerAvatarText:{ fontSize:24, fontWeight:'800', color:'#fff' },
  drawerName:      { fontSize:16, fontWeight:'800' },
  drawerEmail:     { fontSize:12, marginTop:2 },
  drawerDivider:   { height:1, marginVertical:8 },
  drawerItem:      { flexDirection:'row', alignItems:'center', paddingVertical:14, paddingHorizontal:24, gap:14, position:'relative' },
  drawerItemIcon:  { fontSize:18 },
  drawerItemLabel: { fontSize:15 },
  drawerActiveBar: { position:'absolute', right:0, top:8, bottom:8, width:3, backgroundColor:'#00796B', borderRadius:2 },
  drawerLogout:    { flexDirection:'row', alignItems:'center', paddingVertical:14, paddingHorizontal:24, gap:14, marginTop:8 },
  drawerLogoutIcon:{ fontSize:18, color:'#EF4444' },
  drawerLogoutText:{ fontSize:15, fontWeight:'700', color:'#EF4444' },
});