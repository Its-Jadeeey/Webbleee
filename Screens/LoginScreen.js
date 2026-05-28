import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import InputField from '../Components/InputField';
import CustomButton from '../Components/CustomButton';

export default function LoginScreen({ setView }) {
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Fields Required', 'Please fill out all credentials.');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      console.log(e);

Alert.alert(
  'Login Error',
  e.message
);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.brandContainer}>
        <Text style={styles.logoIcon}>📊</Text>
        <Text style={styles.brandName}>TASK TRACKER</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.headline}>Welcome back</Text>
        <Text style={styles.subheadline}>Log in to your focused space.</Text>
        
        <InputField label="Email Address" placeholder="name@company.com" value={email} onChangeText={setEmail} />
        <InputField label="Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
        
        <CustomButton title="Sign In →" onPress={handleLogin} loading={loading} />
        <CustomButton
  title="Continue with Google"
  variant="secondary"
  onPress={async () => {
    try {
      await googleLogin();
    } catch (e) {
      Alert.alert('Google Sign-In Error', e.message);
    }
  }}
/>
        
        <TouchableOpacity onPress={() => setView('SIGNUP')} style={styles.switchLink}>
          <Text style={styles.linkText}>Don't have an account? <Text style={styles.boldTeal}>Sign Up</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', padding: 20 },
  brandContainer: { alignItems: 'center', marginBottom: 24 },
  logoIcon: { fontSize: 36, marginBottom: 4 },
  brandName: { fontSize: 18, fontWeight: '900', color: '#00796B', letterSpacing: 1 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  headline: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  subheadline: { fontSize: 13, color: '#64748B', marginBottom: 20, marginTop: 2 },
  switchLink: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 13, color: '#64748B' },
  boldTeal: { color: '#00796B', fontWeight: '700' }
});