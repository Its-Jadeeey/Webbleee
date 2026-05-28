import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Switch,
} from 'react-native';
import { useAuth } from '../Context/AuthContext';
import { useTask } from '../Context/TaskContext';
import { useTheme } from '../Context/ThemeContext';
import SideDrawer from '../Components/SideDrawer';

export default function ProfileScreen({ setView }) {
  const { user, logout } = useAuth();
  const { tasks } = useTask();
  const { theme, isDark, toggleTheme } = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifModal, setNotifModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);

  // Notification toggles — real state
  const [taskReminders, setTaskReminders] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const percent = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const t = theme; // shorthand

  return (
    <View style={[styles.container, { backgroundColor: t.bg }]}>
      {/* ── TOP NAV ─────────────────────────────────── */}
      <View style={[styles.topNav, { backgroundColor: t.navBg, borderBottomColor: t.border }]}>
        <TouchableOpacity onPress={() => setDrawerOpen(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.menuIcon, { color: t.text }]}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.brandName}>TASK TRACKER</Text>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarSmallText}>
            {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* ── AVATAR + NAME ───────────────────────── */}
        <View style={styles.profileSection}>
          <View style={styles.avatarFrame}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>
                {user?.displayName ? user.displayName[0].toUpperCase() : 'U'}
              </Text>
            </View>
          </View>
          <Text style={[styles.profileName, { color: t.text }]}>{user?.displayName || 'User'}</Text>
          <Text style={[styles.profileEmail, { color: t.textSub }]}>{user?.email || ''}</Text>
        </View>

        {/* ── WEEKLY ACTIVITY CARD ─────────────────── */}
        <View style={[styles.activityCard, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={styles.activityTop}>
            <View>
              <Text style={styles.activityLabel}>WEEKLY ACTIVITY</Text>
              <Text style={[styles.activityTitle, { color: t.text }]}>Tasks Completed</Text>
              <View style={styles.activityCountRow}>
                <Text style={[styles.activityCount, { color: t.text }]}>{completed}</Text>
                <Text style={[styles.activitySub, { color: t.textSub }]}>/ {tasks.length} goals met</Text>
              </View>
            </View>
            <View style={styles.circleWrap}>
              <View style={[styles.circleBg, { borderColor: t.border }]} />
              <View style={styles.circleArc} />
              <Text style={styles.circlePercent}>{percent}%</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: t.chipBg, borderColor: t.border }]}>
              <Text style={styles.statIcon}>⚡</Text>
              <Text style={[styles.statLabel, { color: t.textMuted }]}>Streak</Text>
              <Text style={[styles.statValue, { color: t.text }]}>12 Days</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: t.chipBg, borderColor: t.border, marginLeft: 12 }]}>
              <Text style={styles.statIcon}>🕐</Text>
              <Text style={[styles.statLabel, { color: t.textMuted }]}>Focus Time</Text>
              <Text style={[styles.statValue, { color: t.text }]}>18h</Text>
            </View>
          </View>
        </View>

        {/* ── SETTINGS ────────────────────────────── */}
        <Text style={[styles.settingsHeader, { color: t.text }]}>Settings</Text>
        <View style={[styles.settingsCard, { backgroundColor: t.card, borderColor: t.border }]}>

          {/* Notifications */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => setNotifModal(true)}>
            <View style={[styles.settingIconWrap, { backgroundColor: t.settingIcon }]}>
              <Text style={styles.settingIcon}>🔔</Text>
            </View>
            <View style={styles.settingBody}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Notifications</Text>
              <Text style={[styles.settingSub, { color: t.textMuted }]}>Reminders, alerts, and sounds</Text>
            </View>
            <Text style={[styles.settingChevron, { color: t.border }]}>›</Text>
          </TouchableOpacity>

          <View style={[styles.settingDivider, { backgroundColor: t.border }]} />

          {/* Appearance — real dark mode toggle */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={toggleTheme}>
            <View style={[styles.settingIconWrap, { backgroundColor: t.settingIcon }]}>
              <Text style={styles.settingIcon}>{isDark ? '☀️' : '🌙'}</Text>
            </View>
            <View style={styles.settingBody}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Appearance</Text>
              <Text style={[styles.settingSub, { color: t.textMuted }]}>Theme, colors, and layout</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingRightText}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: '#E2E8F0', true: '#00796B' }}
                thumbColor="#fff"
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
              />
            </View>
          </TouchableOpacity>

          <View style={[styles.settingDivider, { backgroundColor: t.border }]} />

          {/* Help & Support */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7} onPress={() => setHelpModal(true)}>
            <View style={[styles.settingIconWrap, { backgroundColor: t.settingIcon }]}>
              <Text style={styles.settingIcon}>❓</Text>
            </View>
            <View style={styles.settingBody}>
              <Text style={[styles.settingLabel, { color: t.text }]}>Help & Support</Text>
              <Text style={[styles.settingSub, { color: t.textMuted }]}>FAQs, documentation, and chat</Text>
            </View>
            <Text style={[styles.settingChevron, { color: t.border }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── LOGOUT ──────────────────────────────── */}
        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: t.card, borderColor: t.border }]} onPress={logout}>
          <Text style={styles.logoutIcon}>↪</Text>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── SIDE DRAWER ─────────────────────────── */}
      <SideDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentView="PROFILE"
        setView={setView}
      />

      {/* ── NOTIFICATIONS MODAL ─────────────────── */}
      <Modal visible={notifModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: t.card }]}>
            <Text style={[styles.modalTitle, { color: t.text }]}>Notifications</Text>
            <Text style={[styles.modalBody, { color: t.textSub }]}>
              Manage your notification preferences below.
            </Text>

            <View style={[styles.notifRow, { borderBottomColor: t.border }]}>
              <View>
                <Text style={[styles.notifLabel, { color: t.text }]}>Task Reminders</Text>
                <Text style={[styles.notifSub, { color: t.textMuted }]}>Get reminded before tasks are due</Text>
              </View>
              <Switch
                value={taskReminders}
                onValueChange={setTaskReminders}
                trackColor={{ false: '#E2E8F0', true: '#00796B' }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.notifRow, { borderBottomColor: t.border }]}>
              <View>
                <Text style={[styles.notifLabel, { color: t.text }]}>Daily Digest</Text>
                <Text style={[styles.notifSub, { color: t.textMuted }]}>Morning summary of your day</Text>
              </View>
              <Switch
                value={dailyDigest}
                onValueChange={setDailyDigest}
                trackColor={{ false: '#E2E8F0', true: '#00796B' }}
                thumbColor="#fff"
              />
            </View>

            <View style={[styles.notifRow, { borderBottomColor: 'transparent' }]}>
              <View>
                <Text style={[styles.notifLabel, { color: t.text }]}>Sound Alerts</Text>
                <Text style={[styles.notifSub, { color: t.textMuted }]}>Play sound on notifications</Text>
              </View>
              <Switch
                value={soundAlerts}
                onValueChange={setSoundAlerts}
                trackColor={{ false: '#E2E8F0', true: '#00796B' }}
                thumbColor="#fff"
              />
            </View>

            <TouchableOpacity style={styles.modalDone} onPress={() => setNotifModal(false)}>
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── HELP MODAL ──────────────────────────── */}
      <Modal visible={helpModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: t.card }]}>
            <Text style={[styles.modalTitle, { color: t.text }]}>Help & Support</Text>
            <Text style={[styles.modalBody, { color: t.textSub }]}>Need help? Here are some quick options:</Text>
            {[
              { icon: '📖', label: 'Read the FAQs', sub: 'Browse common questions' },
              { icon: '💬', label: 'Chat with Support', sub: 'We reply within 24 hours' },
              { icon: '📧', label: 'Email Us', sub: 'help@tasktracker.app' },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={[styles.helpItem, { borderBottomColor: t.border }]}>
                <Text style={styles.helpIcon}>{item.icon}</Text>
                <View>
                  <Text style={[styles.helpLabel, { color: t.text }]}>{item.label}</Text>
                  <Text style={[styles.helpSub, { color: t.textMuted }]}>{item.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalDone} onPress={() => setHelpModal(false)}>
              <Text style={styles.modalDoneText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1,
  },
  menuIcon: { fontSize: 18 },
  brandName: { fontSize: 13, fontWeight: '900', color: '#00796B', letterSpacing: 1.5 },
  avatarSmall: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#00796B', justifyContent: 'center', alignItems: 'center',
  },
  avatarSmallText: { color: '#fff', fontWeight: '800', fontSize: 13 },

  profileSection: { alignItems: 'center', paddingTop: 28, paddingBottom: 8 },
  avatarFrame: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: '#E0F2F1', borderWidth: 3, borderColor: '#00796B',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarInner: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: '#00796B', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 20, fontWeight: '800' },
  profileEmail: { fontSize: 13, marginTop: 3 },

  activityCard: {
    marginHorizontal: 20, marginTop: 20,
    borderRadius: 20, borderWidth: 1, padding: 20,
  },
  activityTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  activityLabel: { fontSize: 9, fontWeight: '700', color: '#00796B', letterSpacing: 1.2, textTransform: 'uppercase' },
  activityTitle: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  activityCountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginTop: 8 },
  activityCount: { fontSize: 36, fontWeight: '900' },
  activitySub: { fontSize: 13 },
  circleWrap: { width: 64, height: 64, justifyContent: 'center', alignItems: 'center' },
  circleBg: {
    position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 5,
  },
  circleArc: {
    position: 'absolute', width: 60, height: 60, borderRadius: 30,
    borderWidth: 5, borderColor: '#00796B',
    borderRightColor: 'transparent', borderBottomColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
  },
  circlePercent: { fontSize: 13, fontWeight: '800', color: '#00796B' },

  statsRow: { flexDirection: 'row', marginTop: 20 },
  statBox: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14 },
  statIcon: { fontSize: 18, marginBottom: 6 },
  statLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 16, fontWeight: '800', marginTop: 4 },

  settingsHeader: { fontSize: 16, fontWeight: '800', paddingHorizontal: 20, marginTop: 28, marginBottom: 12 },
  settingsCard: { marginHorizontal: 20, borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, gap: 14 },
  settingIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingIcon: { fontSize: 16 },
  settingBody: { flex: 1 },
  settingLabel: { fontSize: 14, fontWeight: '600' },
  settingSub: { fontSize: 11, marginTop: 2 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingRightText: { fontSize: 12, color: '#00796B', fontWeight: '600' },
  settingChevron: { fontSize: 20 },
  settingDivider: { height: 1, marginHorizontal: 16 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 20, marginTop: 16, marginBottom: 12,
    height: 50, borderRadius: 14, borderWidth: 1,
  },
  logoutIcon: { fontSize: 16, color: '#EF4444' },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#EF4444' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalBox: { borderRadius: 20, padding: 24, width: '100%', maxWidth: 380 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  modalBody: { fontSize: 14, lineHeight: 22, marginBottom: 16 },
  modalDone: {
    backgroundColor: '#00796B', height: 46, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginTop: 16,
  },
  modalDoneText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  notifRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1,
  },
  notifLabel: { fontSize: 14, fontWeight: '600' },
  notifSub: { fontSize: 11, marginTop: 2 },

  helpItem: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, borderBottomWidth: 1,
  },
  helpIcon: { fontSize: 22 },
  helpLabel: { fontSize: 14, fontWeight: '600' },
  helpSub: { fontSize: 11, marginTop: 2 },
});