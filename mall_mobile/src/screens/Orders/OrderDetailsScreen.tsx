import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

const orderData = {
  orderNumber: '#12345',
  status: 'Delivered',
  date: 'Nov 10, 2025',
  items: [
    {
      id: '1',
      title: 'Smart LED TV 32 inch',
      price: '$1,500',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300',
    },
  ],
  shippingAddress: {
    name: 'John Doe',
    address: '123 Main Street',
    city: 'San Francisco, California',
    zipCode: '94105',
    phone: '+1 (555) 123-4567',
  },
  timeline: [
    { step: 1, label: 'Order Confirmed', date: 'Nov 10, 8:30 AM', completed: true },
    { step: 2, label: 'Shipped', date: 'Nov 10, 2:15 PM', completed: true },
    { step: 3, label: 'Out for Delivery', date: 'Nov 10, 5:00 PM', completed: true },
    { step: 4, label: 'Delivered', date: 'Nov 10, 7:45 PM', completed: true },
  ],
  subtotal: 1500,
  shipping: 10,
  tax: 150,
};

export default function OrderDetailsScreen({ navigation }: Props) {
  const total = orderData.subtotal + orderData.shipping + orderData.tax;

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <TopBar title="Order Details" onBack={() => navigation.goBack()} />
        </View>

        {/* Order Status Card */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <View>
                <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 4 }}>Order Number</Text>
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>{orderData.orderNumber}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: `${colors.success}20`,
                }}
              >
                <Text style={{ color: colors.success, fontSize: 12, fontWeight: '600' }}>
                  ✓ {orderData.status}
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.muted, fontSize: 12 }}>{orderData.date}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Order Items
          </Text>
          {orderData.items.map((item) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                backgroundColor: colors.card,
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              <Image source={{ uri: item.image }} style={{ width: 80, height: 80 }} />
              <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>{item.price}</Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>Qty: {item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Timeline */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 16 }}>
            Delivery Timeline
          </Text>
          <View>
            {orderData.timeline.map((timeline, index) => (
              <View key={timeline.step} style={{ flexDirection: 'row', marginBottom: index !== orderData.timeline.length - 1 ? 16 : 0 }}>
                {/* Timeline Dot and Line */}
                <View style={{ alignItems: 'center', marginRight: 16 }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: timeline.completed ? colors.success : colors.card,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 2,
                      borderColor: timeline.completed ? colors.success : colors.border,
                    }}
                  >
                    {timeline.completed && (
                      <Ionicons name="checkmark" size={14} color="#121212" />
                    )}
                  </View>
                  {index !== orderData.timeline.length - 1 && (
                    <View
                      style={{
                        width: 2,
                        height: 40,
                        backgroundColor: timeline.completed ? colors.success : colors.border,
                        marginTop: 4,
                      }}
                    />
                  )}
                </View>

                {/* Timeline Content */}
                <View style={{ flex: 1, paddingTop: 2 }}>
                  <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 4 }}>
                    {timeline.label}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {timeline.date}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Shipping Address */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Shipping Address
          </Text>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14 }}>
            <Text style={{ color: colors.text, fontWeight: '600', marginBottom: 8 }}>
              {orderData.shippingAddress.name}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18, marginBottom: 8 }}>
              {orderData.shippingAddress.address}
              {'\n'}
              {orderData.shippingAddress.city}
              {'\n'}
              {orderData.shippingAddress.zipCode}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: colors.bg,
                  borderRadius: 8,
                  paddingVertical: 8,
                }}
              >
                <Ionicons name="call" size={16} color={colors.primary} />
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                  Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  paddingVertical: 8,
                }}
              >
                <Ionicons name="location" size={16} color="#121212" />
                <Text style={{ color: '#121212', fontSize: 12, fontWeight: '600' }}>
                  Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Price Breakdown
          </Text>
          <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 14, gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Subtotal</Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>${orderData.subtotal.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Shipping</Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>${orderData.shipping.toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Tax</Text>
              <Text style={{ color: colors.text, fontWeight: '600' }}>${orderData.tax.toFixed(2)}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 6 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>Total</Text>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20, gap: 10 }}>
          <ActionButton
            title="Track Order"
            onPress={() => {
              console.log('Tracking order:', orderData.orderNumber);
            }}
          />
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              backgroundColor: colors.card,
              paddingVertical: 14,
              borderRadius: 16,
            }}
          >
            <Ionicons name="download" size={18} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '700' }}>
              Download Invoice
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}