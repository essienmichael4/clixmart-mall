import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import Screen from '../../components/Screen';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Onboarding'), 1200);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <Screen padded={false}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center', gap: 12 }}>
          {/* CSL FREIGHT FORWARDING Logo */}
          <Image
            source={require('../../../assets/logo.jpg.png')}
            style={{
              width: 280,
              height: 120,
              resizeMode: 'contain',
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
