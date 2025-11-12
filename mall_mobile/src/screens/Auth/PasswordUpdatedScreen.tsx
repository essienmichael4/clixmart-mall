import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'PasswordUpdated'>;

export default function PasswordUpdatedScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 }}>
        {/* Success Icon */}
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="checkmark" size={50} color="#121212" />
        </View>

        {/* Title */}
        <Text style={{ color: colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center' }}>
          Password has been updated
        </Text>

        {/* Description */}
        <Text style={{ color: colors.muted, fontSize: 14, textAlign: 'center' }}>
          Please press sign in to continue
        </Text>
      </View>

      {/* Sign In Button */}
      <ActionButton
        title="Sign in"
        onPress={() => navigation.replace('Login')}
        style={{ marginBottom: 20 }}
      />
    </Screen>
  );
}
