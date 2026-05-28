import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import InputField from '../Components/InputField';
import CustomButton from '../Components/CustomButton';

export default function SignUpScreen({ setView }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
  if (!name || !email || !password)
    return Alert.alert('Error', 'Please enter all fields.');

  if (password !== confirm)
    return Alert.alert('Error', 'Passwords do not match.');

  setLoading(true);

  try {
    await signup(name, email.trim(), password);
    // NO navigation needed — AuthContext will auto switch UI
  } catch (e) {
    console.log(e);
    Alert.alert('Sign Up Error', e.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.headline}>Create Account</Text>
        <Text style={styles.subheadline}>Start organizing your day with cognitive clarity.</Text>
        
        <InputField label="Full Name" placeholder="John Doe" value={name} onChangeText={setName} />
        <InputField label="Email Address" placeholder="name@example.com" value={email} onChangeText={setEmail} />
        <InputField label="Password" placeholder="••••••••" secureTextEntry value={password} onChangeText={setPassword} />
        <InputField label="Confirm Password" placeholder="••••••••" secureTextEntry value={confirm} onChangeText={setConfirm} />
        
        <CustomButton title="Create Account →" onPress={handleSignup} loading={loading} />
        
        <TouchableOpacity onPress={() => setView('LOGIN')} style={styles.switchLink}>
          <Text style={styles.linkText}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  headline: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  subheadline: { fontSize: 13, color: '#64748B', marginBottom: 20, marginTop: 2 },
  switchLink: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 13, color: '#00796B', fontWeight: '700' }
});