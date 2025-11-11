import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const cartItems = [
  {
    id: '1',
    title: 'Smart LED TV 32 inch',
    price: '$1,500',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300',
    quantity: 1,
  },
  {
    id: '2',
    title: 'Sony WH-1000XM4 Headphones',
    price: '$349.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    quantity: 2,
  },
];

export default function CartScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [items, setItems] = useState(cartItems);

  const updateQuantity = (id: string, delta: number) => {
    setItems(
      items
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0);

  const shipping = 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>Your Cart</Text>
        </View>

        {/* Cart Items */}
        {items.length > 0 ? (
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            {items.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 12,
                }}
              >
                <Image source={{ uri: item.image }} style={{ width: 80, height: 80 }} />
                <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>{item.price}</Text>
                </View>
                <View style={{ padding: 8, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Ionicons name="close" size={16} color={colors.muted} />
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: colors.bg, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                      <Ionicons name="remove" size={14} color={colors.muted} />
                    </TouchableOpacity>
                    <Text style={{ color: colors.text, fontSize: 12, fontWeight: '600', minWidth: 18, textAlign: 'center' }}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                      <Ionicons name="add" size={14} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, paddingVertical: 40, alignItems: 'center' }}>
            <Ionicons name="cart" size={48} color={colors.muted} />
            <Text style={{ color: colors.muted, marginTop: 12, fontSize: 14 }}>Your cart is empty</Text>
          </View>
        )}

        {/* Price Summary */}
        {items.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.muted, fontSize: 13 }}>Subtotal</Text>
                <Text style={{ color: colors.text, fontWeight: '600' }}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.muted, fontSize: 13 }}>Shipping</Text>
                <Text style={{ color: colors.text, fontWeight: '600' }}>${shipping.toFixed(2)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.muted, fontSize: 13 }}>Tax</Text>
                <Text style={{ color: colors.text, fontWeight: '600' }}>${tax.toFixed(2)}</Text>
              </View>
              <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Total</Text>
                <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {items.length > 0 && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <ActionButton
            title="Proceed to Checkout"
            onPress={() => navigation.navigate('Checkout')}
          />
        </View>
      )}
    </Screen>
  );
}