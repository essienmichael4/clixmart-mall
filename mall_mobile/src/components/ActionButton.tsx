import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  icon?: React.ReactNode;
};

export default function ActionButton({ title, onPress, style, icon }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]}>
      {icon}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  text: {
    color: '#121212',
    fontWeight: '700',
    fontSize: 16,
  },
});