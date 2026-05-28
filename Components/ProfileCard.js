import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileCard({ name, email }) {
  return (
    <View style={styles.container}>
      <View style={styles.picFrame}>
        <Text style={styles.picText}>{name ? name[0].toUpperCase() : 'B'}</Text>
      </View>
      <Text style={styles.name}>{name || 'Benedic Margario'}</Text>
      <Text style={styles.email}>{email || 'benedic@gmail.com'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 24 },
  picFrame: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#E0F2F1', borderWidth: 3, borderColor: '#00796B', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  picText: { fontSize: 32, fontWeight: '800', color: '#00796B' },
  name: { fontSize: 20, fontWeight: '800', color: '#1E293B' },
  email: { fontSize: 14, color: '#64748B', marginTop: 2 }
});