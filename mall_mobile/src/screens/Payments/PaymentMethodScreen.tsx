import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const savedPaymentMethods = [
  {
    id: '1',
    type: 'credit-card',
    name: 'Visa Card',
    lastFour: '4242',
    expiry: '12/26',
    isDefault: true,
    cardBrand: 'Visa',
  },
  {
    id: '2',
    type: 'credit-card',
    name: 'Mastercard',
    lastFour: '5555',
    expiry: '08/25',
    isDefault: false,
    cardBrand: 'Mastercard',
  },
  {
    id: '3',
    type: 'wallet',
    name: 'Google Pay',
    email: 'user@gmail.com',
    isDefault: false,
  },
];

export default function PaymentMethodScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMethodId, setSelectedMethodId] = useState(savedPaymentMethods.find((m) => m.isDefault)?.id);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeletePaymentMethod = (id: string) => {
    setDeletingId(id);
    setTimeout(() => setDeletingId(null), 300);
  };

  const handleSetDefault = (id: string) => {
    setSelectedMethodId(id);
  };

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <TopBar title="Payment Methods" onBack={() => navigation.goBack()} />
        </View>

        {/* Saved Payment Methods */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Saved Payment Methods
          </Text>

          {savedPaymentMethods.map((method) => (
            <View
              key={method.id}
              style={[
                {
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  marginBottom: 12,
                  overflow: 'hidden',
                  borderWidth: 2,
                  borderColor: selectedMethodId === method.id ? colors.primary : colors.border,
                },
                deletingId === method.id && { opacity: 0.5 },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleSetDefault(method.id)}
                style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}
              >
                {/* Payment Icon */}
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    backgroundColor: colors.bg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {method.type === 'credit-card' ? (
                    <Ionicons name="card" size={24} color={colors.primary} />
                  ) : (
                    <Ionicons name="wallet" size={24} color={colors.primary} />
                  )}
                </View>

                {/* Payment Details */}
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 4 }}>
                    {method.name}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>
                    {method.type === 'credit-card'
                      ? `•••• •••• •••• ${method.lastFour}`
                      : (method as any).email}
                  </Text>
                  {method.type === 'credit-card' && (
                    <Text style={{ color: colors.muted, fontSize: 10, marginTop: 2 }}>
                      Expires: {(method as any).expiry}
                    </Text>
                  )}
                </View>

                {/* Selection Radio */}
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedMethodId === method.id ? colors.primary : colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {selectedMethodId === method.id && (
                    <View
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: colors.primary,
                      }}
                    />
                  )}
                </View>
              </TouchableOpacity>

              {/* Delete and Default Actions */}
              <View
                style={{
                  flexDirection: 'row',
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                  gap: 1,
                }}
              >
                {selectedMethodId !== method.id && (
                  <TouchableOpacity
                    onPress={() => handleSetDefault(method.id)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: `${colors.primary}10`,
                    }}
                  >
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                      Set Default
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDeletePaymentMethod(method.id)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: `${colors.danger}10`,
                  }}
                >
                  <Text style={{ color: colors.danger, fontSize: 12, fontWeight: '600' }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add New Payment Method */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Add New Payment Method
          </Text>

          {/* Credit Card Option */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Cards')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                backgroundColor: colors.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="card" size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 4 }}>
                Credit Card
              </Text>
              <Text style={{ color: colors.muted, fontSize: 11 }}>
                Visa, Mastercard, American Express
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>

          {/* Debit Card Option */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: 0.6,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                backgroundColor: colors.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="card" size={24} color={colors.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 4 }}>
                Debit Card
              </Text>
              <Text style={{ color: colors.muted, fontSize: 11 }}>
                Coming Soon
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>

          {/* Digital Wallet Option */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: 0.6,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                backgroundColor: colors.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="wallet" size={24} color={colors.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 4 }}>
                Digital Wallet
              </Text>
              <Text style={{ color: colors.muted, fontSize: 11 }}>
                Google Pay, Apple Pay
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>

          {/* Bank Transfer Option */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: 0.6,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                backgroundColor: colors.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="swap-horizontal" size={24} color={colors.muted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 4 }}>
                Bank Transfer
              </Text>
              <Text style={{ color: colors.muted, fontSize: 11 }}>
                Direct bank payment
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Security Info */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: `${colors.success}10`,
              borderRadius: 12,
              padding: 12,
              flexDirection: 'row',
              gap: 10,
            }}
          >
            <Ionicons name="shield-checkmark" size={20} color={colors.success} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700', marginBottom: 2 }}>
                Your payments are secure
              </Text>
              <Text style={{ color: colors.success, fontSize: 11, opacity: 0.8 }}>
                We use industry-standard SSL encryption to protect your data
              </Text>
            </View>
          </View>
        </View>

        {/* Proceed Button */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <ActionButton
            title="Continue with Selected Method"
            onPress={() => {
              const selected = savedPaymentMethods.find((m) => m.id === selectedMethodId);
              console.log('Proceeding with payment method:', selected);
              navigation.goBack();
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}