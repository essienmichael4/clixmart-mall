import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Cards'>;

export default function CardsScreen({ navigation }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <TopBar title="Add new card" onBack={() => navigation.goBack()} />

          {/* Card Preview */}
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 20,
              marginTop: 24,
              marginBottom: 28,
              aspectRatio: 16 / 10,
            }}
          >
            {/* Card Top Section */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <Ionicons name="wallet" size={28} color={colors.muted} />
              <Ionicons name="ellipsis-horizontal" size={24} color={colors.muted} />
            </View>

            {/* Card Number Display */}
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600', letterSpacing: 2, marginBottom: 20 }}>
              {cardNumber || '5698  56254  6786  9979'}
            </Text>

            {/* Card Holder and Logo */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <View>
                <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>Card Holder</Text>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                  {cardHolder || 'Name Here'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 2 }}>
                <View
                  style={{
                    width: 24,
                    height: 15,
                    borderRadius: 2,
                    backgroundColor: '#FF5F00',
                  }}
                />
                <View
                  style={{
                    width: 24,
                    height: 15,
                    borderRadius: 2,
                    backgroundColor: '#EB001B',
                  }}
                />
              </View>
            </View>
          </View>

          {/* Form Section */}
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 16 }}>
            Enter Your Informations
          </Text>

          {/* Card Number Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>Card number</Text>
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
              <TextInput
                placeholder="0000 0000 0000 0000"
                placeholderTextColor={colors.muted}
                value={cardNumber}
                onChangeText={formatCardNumber}
                keyboardType="number-pad"
                maxLength={19}
                style={{
                  flex: 1,
                  color: colors.text,
                }}
              />
              <View style={{ flexDirection: 'row', gap: 2 }}>
                <View
                  style={{
                    width: 20,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: '#FF5F00',
                  }}
                />
                <View
                  style={{
                    width: 20,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: '#EB001B',
                  }}
                />
              </View>
            </View>
          </View>

          {/* Card Holder Input */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>Card Holder</Text>
            <TextInput
              placeholder="Enter card holder name"
              placeholderTextColor={colors.muted}
              value={cardHolder}
              onChangeText={setCardHolder}
              style={{
                backgroundColor: colors.card,
                color: colors.text,
                borderRadius: 12,
                padding: 12,
              }}
            />
          </View>

          {/* Exp Date and CVV Row */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>Exp date</Text>
              <TextInput
                placeholder="MM/YY"
                placeholderTextColor={colors.muted}
                value={expDate}
                onChangeText={setExpDate}
                keyboardType="number-pad"
                maxLength={5}
                style={{
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderRadius: 12,
                  padding: 12,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>CVV</Text>
              <TextInput
                placeholder="000"
                placeholderTextColor={colors.muted}
                value={cvv}
                onChangeText={setCvv}
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
                style={{
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderRadius: 12,
                  padding: 12,
                }}
              />
            </View>
          </View>

          {/* Continue Button */}
          <ActionButton
            title="Continue"
            onPress={() => {
              console.log('Card added:', { cardNumber, cardHolder, expDate, cvv });
              navigation.goBack();
            }}
            style={{ marginBottom: 20 }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}