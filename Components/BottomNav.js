import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../Context/ThemeContext';

const TABS = [
  { key: 'HOME',    icon: '⊞', label: 'Home'    },
  { key: 'TASKS',   icon: '☑',  label: 'Tasks'   },
  { key: 'PROFILE', icon: '◉',  label: 'Profile' },
];

export default function BottomNav({ currentView, setView }) {
  const { theme: t } = useTheme();
  return (
    <View style={[s.nav, { backgroundColor: t.navBg, borderTopColor: t.border }]}>
      {TABS.map((tab) => {
        const isActive = currentView === tab.key;
        return (
          <TouchableOpacity key={tab.key} style={s.tab} onPress={() => setView(tab.key)} activeOpacity={0.7}>
            <Text style={[s.tabIcon, { color: isActive ? '#00796B' : t.textMuted }]}>{tab.icon}</Text>
            <Text style={[s.tabLabel, { color: isActive ? '#00796B' : t.textMuted }, isActive && s.tabLabelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={s.activeBar} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  nav:            { height:64, flexDirection:'row', borderTopWidth:1 },
  tab:            { flex:1, alignItems:'center', justifyContent:'center', position:'relative', paddingTop:4 },
  tabIcon:        { fontSize:18, marginBottom:2 },
  tabLabel:       { fontSize:11, fontWeight:'600' },
  tabLabelActive: { fontWeight:'700' },
  activeBar:      { position:'absolute', top:0, width:28, height:3, backgroundColor:'#00796B', borderRadius:2 },
});