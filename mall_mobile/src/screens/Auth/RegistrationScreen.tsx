import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Registration'>;

export default function RegistrationScreen({ navigation }: Props) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Screen>
      <TopBar title="Get Started" onBack={() => navigation.goBack()} />
      <View style={{ gap: 12, marginTop: 16, flex: 1 }}>
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

        {/* Password Input */}
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
          <Ionicons name="lock-closed" size={18} color={colors.muted} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={{
              flex: 1,
              color: colors.text,
            }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={18}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>

        {/* Confirm Password Input */}
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
          <Ionicons name="lock-closed" size={18} color={colors.muted} />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showConfirmPassword}
            value={confirm}
            onChangeText={setConfirm}
            style={{
              flex: 1,
              color: colors.text,
            }}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={18}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>

        <ActionButton title="Sign Up" onPress={() => navigation.replace('HomeTabs')} style={{ marginTop: 16 }} />

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text style={{ color: colors.muted, fontSize: 12 }}>Or continue with</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>

        {/* Sign In Link */}
        <View style={{ marginTop: 'auto', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>
              Already have an account?{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}