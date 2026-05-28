import React from 'react';

import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const colors = {
  primary: '#00796B',
  text: '#1E293B',
  border: '#E2E8F0',
  white: '#FFFFFF',
};

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading,
}) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isPrimary
          ? styles.btnPrimary
          : styles.btnSecondary,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator
          color={
            isPrimary
              ? colors.white
              : colors.text
          }
        />
      ) : (
        <Text
          style={[
            styles.text,
            isPrimary
              ? styles.textPrimary
              : styles.textSecondary,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  btnPrimary: {
    backgroundColor: colors.primary,
  },

  btnSecondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },

  text: {
    fontSize: 14,
    fontWeight: '700',
  },

  textPrimary: {
    color: colors.white,
  },

  textSecondary: {
    color: colors.text,
  },
});