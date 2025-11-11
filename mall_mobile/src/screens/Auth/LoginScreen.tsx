import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import ActionButton from '../../components/ActionButton';
import TopBar from '../../components/TopBar';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Screen>
      <TopBar title="Welcome Back!" />
      <View style={{ gap: 16, marginTop: 20, flex: 1 }}>
        <Text style={{ color: colors.muted, fontSize: 14 }}>Enter your details below</Text>
        
        <View style={{ gap: 12 }}>
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
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
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
          <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
            <Text style={{ color: colors.muted, textAlign: 'right' }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <ActionButton
          title="Log In"
          onPress={() => navigation.replace('HomeTabs')}
          style={{ marginTop: 12 }}
        />

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
          <Text style={{ color: colors.muted, fontSize: 12 }}>Or continue with</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border }} />
        </View>

        {/* Social Login Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: colors.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 24 }}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: colors.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 24 }}>🍎</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={{ marginTop: 'auto', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
            <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>
              Already have an account?{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}