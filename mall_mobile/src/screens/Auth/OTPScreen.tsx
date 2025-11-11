import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

export default function OTPScreen({ navigation }: Props) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <Screen>
      <TopBar title="Verification Code" onBack={() => navigation.goBack()} />
      <View style={{ gap: 16, marginTop: 16, flex: 1 }}>
        <Text style={{ color: colors.muted, fontSize: 14 }}>
          You need to enter a 4 digit code we sent to your Phone number.
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8, justifyContent: 'center' }}>
          {otp.map((v, i) => (
            <TextInput
              key={i}
              ref={inputs[i]}
              value={v}
              onChangeText={(t) => {
                const next = [...otp];
                next[i] = t.slice(0, 1);
                setOtp(next);
                if (t && inputs[i + 1]?.current) inputs[i + 1].current?.focus();
              }}
              keyboardType="number-pad"
              style={{
                width: 60,
                height: 60,
                textAlign: 'center',
                borderRadius: 12,
                backgroundColor: colors.card,
                color: colors.text,
                fontSize: 20,
                fontWeight: '700',
              }}
            />
          ))}
        </View>

        <TouchableOpacity style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            Didn't get the code yet? <Text style={{ color: colors.primary }}>Resend (2:35)</Text>
          </Text>
        </TouchableOpacity>

        <ActionButton
          title="Confirm"
          onPress={() => navigation.navigate('CreateNewPassword')}
          style={{ marginTop: 16 }}
        />

        <View style={{ marginTop: 'auto', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>
              Wrong number?{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Go Back</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}