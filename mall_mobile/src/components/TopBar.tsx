import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type Props = {
  title?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function TopBar({ title, onBack, rightIcon, onRightPress }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
      }}
    >
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={{
            height: 36,
            width: 36,
            borderRadius: 18,
            backgroundColor: colors.card,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
      <Text style={{ flex: 1, color: colors.text, fontSize: 18, fontWeight: '700' }}>
        {title ?? ''}
      </Text>
      {rightIcon ? (
        <TouchableOpacity
          onPress={onRightPress}
          style={{
            height: 36,
            width: 36,
            borderRadius: 18,
            backgroundColor: colors.card,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={rightIcon} size={20} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );
}