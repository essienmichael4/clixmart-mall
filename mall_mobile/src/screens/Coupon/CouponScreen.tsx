import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Coupon'>;

const coupons = [
  {
    id: '1',
    discount: '50% OFF',
    code: 'DCYBAGA',
    icon: '🛍️',
    backgroundColor: colors.card,
    isHighlighted: false,
  },
  {
    id: '2',
    discount: '30% OFF',
    code: 'DCYBAGA',
    icon: '🎬',
    backgroundColor: colors.primary,
    isHighlighted: true,
  },
];

export default function CouponScreen({ navigation }: Props) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <Screen padded={false}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <TopBar title="Coupon" onBack={() => navigation.goBack()} />
      </View>

      {/* Coupons List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 }}
      >
        {coupons.map((coupon) => (
          <TouchableOpacity
            key={coupon.id}
            style={[
              styles.couponCard,
              {
                backgroundColor: coupon.backgroundColor,
                borderWidth: 1,
                borderColor: coupon.isHighlighted ? colors.primary : 'transparent',
                borderStyle: 'dashed',
              },
            ]}
          >
            {/* Left Section - Discount and Icon */}
            <View style={styles.leftSection}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: coupon.isHighlighted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(159, 160, 161, 0.1)',
                  },
                ]}
              >
                <Text style={styles.icon}>{coupon.icon}</Text>
              </View>
              <Text
                style={[
                  styles.discountText,
                  {
                    color: coupon.isHighlighted ? '#121212' : colors.text,
                  },
                ]}
              >
                {coupon.discount}
              </Text>
            </View>

            {/* Divider */}
            <View
              style={[
                styles.divider,
                {
                  borderColor: coupon.isHighlighted ? 'rgba(255, 255, 255, 0.3)' : 'rgba(159, 160, 161, 0.2)',
                },
              ]}
            />

            {/* Right Section - Code */}
            <TouchableOpacity
              onPress={() => handleCopyCode(coupon.code)}
              style={styles.rightSection}
            >
              <Text
                style={[
                  styles.codeText,
                  {
                    color: coupon.isHighlighted ? '#121212' : colors.text,
                  },
                ]}
              >
                {coupon.code}
              </Text>
              <Text
                style={[
                  styles.copyText,
                  {
                    color: coupon.isHighlighted ? '#121212' : colors.muted,
                    opacity: copiedCode === coupon.code ? 1 : 0,
                  },
                ]}
              >
                {copiedCode === coupon.code ? 'Copied!' : ''}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  couponCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  leftSection: {
    flex: 0.4,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 28,
  },
  discountText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 60,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginHorizontal: 12,
  },
  rightSection: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  copyText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});