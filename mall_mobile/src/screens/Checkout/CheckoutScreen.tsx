import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const checkoutData = {
  items: [
    {
      id: '1',
      title: 'Smart LED TV 32 inch',
      price: '$1,500',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300',
    },
    {
      id: '2',
      title: 'Sony WH-1000XM4 Headphones',
      price: '$349.99',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    },
  ],
  shippingAddress: {
    name: 'John Doe',
    address: '123 Main Street',
    city: 'San Francisco, California 94105',
  },
  subtotal: 1849.99,
  shipping: 20,
  tax: 185,
};

export default function CheckoutScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const total = checkoutData.subtotal + checkoutData.shipping + checkoutData.tax;
  const discount = appliedCoupon ? checkoutData.subtotal * 0.3 : 0;
  const finalTotal = total - discount;

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <TopBar title="Checkout" onBack={() => navigation.goBack()} />
        </View>

        {/* Order Items Preview */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Order Items ({checkoutData.items.length})
          </Text>
          {checkoutData.items.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                backgroundColor: colors.card,
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <Image source={{ uri: item.image }} style={{ width: 70, height: 70 }} />
              <View style={{ flex: 1, padding: 10, justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 12 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 12 }}>
                    {item.price}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 11 }}>Qty: {item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Delivery Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DeliveryAddress')}>
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>Change</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14 }}>
            <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 6 }}>
              {checkoutData.shippingAddress.name}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
              {checkoutData.shippingAddress.address}
              {'\n'}
              {checkoutData.shippingAddress.city}
            </Text>
          </View>
        </View>

        {/* Payment Method Selection */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Payment Method</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PaymentMethod')}>
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>Add New</Text>
            </TouchableOpacity>
          </View>

          {/* Card Payment Option */}
          <TouchableOpacity
            onPress={() => setSelectedPaymentMethod('card')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 12,
              marginBottom: 8,
              borderWidth: 2,
              borderColor: selectedPaymentMethod === 'card' ? colors.primary : colors.border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="card" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 4 }}>Credit Card</Text>
              <Text style={{ color: colors.muted, fontSize: 11 }}>•••• •••• •••• 4242</Text>
            </View>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedPaymentMethod === 'card' ? colors.primary : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedPaymentMethod === 'card' && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>

          {/* Wallet Payment Option */}
          <TouchableOpacity
            onPress={() => setSelectedPaymentMethod('wallet')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 12,
              borderWidth: 2,
              borderColor: selectedPaymentMethod === 'wallet' ? colors.primary : colors.border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="wallet" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 4 }}>Digital Wallet</Text>
              <Text style={{ color: colors.muted, fontSize: 11 }}>Google Pay • Apple Pay</Text>
            </View>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedPaymentMethod === 'wallet' ? colors.primary : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedPaymentMethod === 'wallet' && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Coupon/Promo Code */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Promo Code
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Coupon')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: appliedCoupon ? colors.primary : colors.border,
            }}
          >
            <Ionicons name="ticket" size={18} color={appliedCoupon ? colors.primary : colors.muted} style={{ marginRight: 10 }} />
            <Text
              style={{
                flex: 1,
                color: appliedCoupon ? colors.primary : colors.muted,
                fontSize: 13,
                fontWeight: appliedCoupon ? '700' : '500',
              }}
            >
              {appliedCoupon ? `${appliedCoupon} Applied` : 'Apply Coupon Code'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Price Breakdown */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Subtotal</Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>${checkoutData.subtotal.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Shipping</Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>${checkoutData.shipping.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Tax</Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>${checkoutData.tax.toFixed(2)}</Text>
            </View>
            {appliedCoupon && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.success, fontSize: 12 }}>Discount (30%)</Text>
                <Text style={{ color: colors.success, fontWeight: '600' }}>-${discount.toFixed(2)}</Text>
              </View>
            )}
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 6 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Total</Text>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Ionicons name="checkbox" size={16} color={colors.primary} style={{ marginTop: 2 }} />
            <Text style={{ flex: 1, color: colors.muted, fontSize: 11, lineHeight: 16 }}>
              I agree to the{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms and Conditions</Text> and{' '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
            </Text>
          </View>
        </View>

        {/* Place Order Button */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <ActionButton
            title="Place Order"
            onPress={() => {
              console.log('Order placed:', {
                items: checkoutData.items,
                payment: selectedPaymentMethod,
                coupon: appliedCoupon,
                total: finalTotal,
              });
              navigation.navigate('OrderProgress', { id: '12345' });
            }}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}