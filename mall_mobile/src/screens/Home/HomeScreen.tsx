import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ProductCard from './ProductCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const flashSalesProducts = [
  {
    id: '1',
    title: 'LG Smart LED TV 32 inch',
    price: '$1,500',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
  },
  {
    id: '2',
    title: 'Apple 2021 Apple 16-inch MacBook Pro',
    price: '$2,039.90',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
  },
];

const topBrands = [
  { id: '1', name: 'SONY', image: 'https://via.placeholder.com/80?text=SONY' },
  { id: '2', name: 'LG', image: 'https://via.placeholder.com/80?text=LG' },
  { id: '3', name: 'JBL', image: 'https://via.placeholder.com/80?text=JBL' },
  { id: '4', name: 'BOSE', image: 'https://via.placeholder.com/80?text=BOSE' },
];

const moreProducts = [
  {
    id: '3',
    title: 'Sony WH-1000XM4 Headphones',
    price: '$349.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    id: '4',
    title: 'iPad Pro 12.9-inch',
    price: '$1,099',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
  },
  {
    id: '5',
    title: 'Samsung Galaxy Watch 5',
    price: '$279.99',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
  {
    id: '6',
    title: 'DJI Mini 3 Drone',
    price: '$399',
    image: 'https://images.unsplash.com/photo-1506434985556-37ffcde514b4?w=500',
  },
];

function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Delivery Address */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Delivery Address</Text>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 4 }}>
                San Francisco,california
              </Text>
            </View>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: colors.card,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="bag" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.card,
              borderRadius: 12,
              paddingHorizontal: 12,
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              placeholder="Search product or category..."
              placeholderTextColor={colors.muted}
              style={{
                flex: 1,
                color: colors.text,
                paddingVertical: 12,
                fontSize: 13,
              }}
            />
          </View>
        </View>

        {/* Flash Sales Banner */}
        <View style={{ paddingHorizontal: 16, marginTop: 16, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FlashSales')}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#121212', fontWeight: '700', fontSize: 16 }}>
                Flash Sales Every Day
              </Text>
              <Text style={{ color: '#121212', fontSize: 12, marginTop: 4, opacity: 0.8 }}>
                1h : 23h : 19m : 21s
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#121212" />
          </TouchableOpacity>
        </View>

        {/* Electronic Deals Section */}
        <View>
          <View style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Electronic Deals</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.muted, fontSize: 12 }}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 16 }}
            contentContainerStyle={{ gap: 12 }}
          >
            {flashSalesProducts.map((product) => (
              <ProductCard
                key={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                onPress={() => navigation.navigate('ProductDetails', { id: product.id })}
              />
            ))}
          </ScrollView>
        </View>

        {/* Top Brands Section */}
        <View style={{ marginTop: 28 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Top Brands</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.muted, fontSize: 12 }}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 16 }}
            contentContainerStyle={{ gap: 12 }}
          >
            {topBrands.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  backgroundColor: colors.card,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.text, fontWeight: '700', fontSize: 12 }}>
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* More Products Section */}
        <View style={{ marginTop: 28, marginBottom: 20 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>More Products</Text>
            <TouchableOpacity>
              <Text style={{ color: colors.muted, fontSize: 12 }}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 16 }}>
            {moreProducts.map((product, index) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => navigation.navigate('ProductDetails', { id: product.id })}
                style={{
                  flexDirection: 'row',
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: index !== moreProducts.length - 1 ? 12 : 0,
                }}
              >
                <Image
                  source={{ uri: product.image }}
                  style={{ width: 100, height: 100 }}
                />
                <View style={{ flex: 1, padding: 12, justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.text, fontWeight: '600', fontSize: 13 }} numberOfLines={2}>
                    {product.title}
                  </Text>
                  <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 14 }}>
                    {product.price}
                  </Text>
                </View>
                <View style={{ padding: 12, justifyContent: 'center', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="add" size={18} color="#121212" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </Screen>
  );
}

export default HomeScreen;
