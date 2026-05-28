import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header({ name }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Good morning,</Text>
        <Text style={styles.subtitle}>{name || 'benedic'}</Text>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : 'B'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 12 },
  title: { fontSize: 14, color: '#64748B' },
  subtitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00796B', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: '700', fontSize: 16 }
});