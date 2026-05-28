import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { AuthProvider, useAuth } from './Context/AuthContext';
import { TaskProvider } from './Context/TaskContext';
import { ThemeProvider, useTheme } from './Context/ThemeContext';

import AuthNavigator from './Navigation/AuthNavigator';
import AppNavigator from './Navigation/AppNavigator';
import BottomNav from './Components/BottomNav';

function ApplicationShell() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  const [currentView, setView] = useState('HOME');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const prevUserRef = useRef(null);
  useEffect(() => {
    if (user && prevUserRef.current === null) {
      setView('HOME');
      setSelectedTaskId(null);
    }
    prevUserRef.current = user;
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {!user ? (
        <AuthNavigator />
      ) : (
        <>
          <AppNavigator
            currentView={currentView}
            setView={setView}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
          />
          <BottomNav currentView={currentView} setView={setView} />
        </>
      )}
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <ThemeProvider>
          <ApplicationShell />
        </ThemeProvider>
      </TaskProvider>
    </AuthProvider>
  );
}