import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const orders = [
  {
    id: '1',
    orderNumber: '#12345',
    date: 'Nov 10, 2025',
    status: 'Delivered',
    total: '$1,500',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300',
  },
  {
    id: '2',
    orderNumber: '#12344',
    date: 'Nov 08, 2025',
    status: 'In Transit',
    total: '$349.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
  },
  {
    id: '3',
    orderNumber: '#12343',
    date: 'Nov 05, 2025',
    status: 'Delivered',
    total: '$89.99',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered':
      return colors.success;
    case 'In Transit':
      return colors.warning;
    case 'Pending':
      return colors.danger;
    default:
      return colors.muted;
  }
};

export default function OrdersScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 }}>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>My Orders</Text>
        </View>

        {/* Orders List */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => navigation.navigate('OrderDetails', { id: order.id })}
              style={{
                flexDirection: 'row',
                backgroundColor: colors.card,
                borderRadius: 12,
                overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              {/* Order Image */}
              <Image source={{ uri: order.image }} style={{ width: 80, height: 80 }} />

              {/* Order Info */}
              <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ color: colors.text, fontWeight: '700', fontSize: 13 }} numberOfLines={1}>
                    {order.orderNumber}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 11, marginTop: 2 }}>
                    {order.date}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.primary, fontWeight: '700' }}>{order.total}</Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      backgroundColor: `${getStatusColor(order.status)}20`,
                    }}
                  >
                    <Text style={{ color: getStatusColor(order.status), fontSize: 10, fontWeight: '600' }}>
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Chevron */}
              <View style={{ paddingRight: 12, justifyContent: 'center' }}>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}