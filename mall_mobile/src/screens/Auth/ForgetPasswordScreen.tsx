import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgetPassword'>;

export default function ForgetPasswordScreen({ navigation }: Props) {
  const [mobile, setMobile] = useState('');
  return (
    <Screen>
      <TopBar title="Forget Password" onBack={() => navigation.goBack()} />
      <View style={{ gap: 16, marginTop: 16, flex: 1 }}>
        <Text style={{ color: colors.muted, fontSize: 14 }}>
          We need your phone number so we can send a verification code to reset your password.
        </Text>

        {/* Mobile Number Input */}
        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Ionicons name="call" size={18} color={colors.muted} />
          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor={colors.muted}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            style={{
              flex: 1,
              color: colors.text,
            }}
          />
        </View>

        <ActionButton
          title="Send Code"
          onPress={() => navigation.navigate('OTP')}
          style={{ marginTop: 12 }}
        />

        <View style={{ marginTop: 'auto', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>
              Remember your password?{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}