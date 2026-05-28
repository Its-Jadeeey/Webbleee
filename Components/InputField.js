import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const colors = {
  textMuted: '#94A3B8',
  text: '#1E293B',
  primary: '#00796B',
  border: '#E2E8F0',
  surface: '#F1F5F9',
};

export default function InputField({
  label,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  isPassword,
}) {
  const [hidePassword, setHidePassword] =
    useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>

        {isPassword && (
          <TouchableOpacity
            onPress={() =>
              setHidePassword(!hidePassword)
            }
          >
            <Text style={styles.forgotLink}>
              {hidePassword ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={
            isPassword
              ? hidePassword
              : secureTextEntry
          }
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  forgotLink: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },

  inputWrapper: {
    width: '100%',
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    justifyContent: 'center',
  },

  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
    outlineStyle: 'none',
  },
});