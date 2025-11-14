import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateNewPassword'>;

export default function CreateNewPasswordScreen({ navigation }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Screen>
      <TopBar title="Rest your Password" onBack={() => navigation.goBack()} />
      <View style={{ gap: 16, marginTop: 16, flex: 1 }}>
        <Text style={{ color: colors.muted, fontSize: 14 }}>
          Create a new password. Ensure it's at least 8 characters.
        </Text>

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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
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

        <ActionButton
          title="Create new password"
          onPress={() => navigation.navigate('PasswordUpdated')}
          style={{ marginTop: 16 }}
        />

        <View style={{ marginTop: 'auto', marginBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
