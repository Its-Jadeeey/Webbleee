import React, { createContext, useState, useContext } from 'react';

const light = {
  isDark: false,
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  text: '#1E293B',
  textSub: '#64748B',
  textMuted: '#94A3B8',
  navBg: '#FFFFFF',
  inputBg: '#F1F5F9',
  chipBg: '#F8FAFC',
  settingIcon: '#F1F5F9',
  upcomingBg: '#FFFFFF',
  dangerBg: '#FEF2F2',
};

const dark = {
  isDark: true,
  bg: '#0F172A',
  card: '#1E293B',
  border: '#334155',
  text: '#F1F5F9',
  textSub: '#94A3B8',
  textMuted: '#64748B',
  navBg: '#1E293B',
  inputBg: '#0F172A',
  chipBg: '#0F172A',
  settingIcon: '#0F172A',
  upcomingBg: '#1E293B',
  dangerBg: '#2D1515',
};

const ThemeContext = createContext({});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? dark : light;
  const toggleTheme = () => setIsDark((p) => !p);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);