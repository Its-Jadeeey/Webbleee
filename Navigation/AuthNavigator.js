import React, { useState } from 'react';
import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';

export default function AuthNavigator() {
  const [authView, setAuthView] = useState('LOGIN');

  if (authView === 'SIGNUP') {
    return <SignUpScreen setView={setAuthView} />;
  }
  return <LoginScreen setView={setAuthView} />;
}