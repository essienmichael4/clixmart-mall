import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';
import ProductCard from '../Home/ProductCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const allFlashSalesProducts = [
  {
    id: '1',
    title: 'LG Smart LED TV 32 inch',
    price: '$1,500',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
  },
  {
    id: '2',
    title: 'Apple 2021 MacBook Pro 16-inch',
    price: '$2,039.90',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
  },
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
  {
    id: '7',
    title: 'Nintendo Switch Console',
    price: '$299.99',
    image: 'https://images.unsplash.com/photo-1605901287671-07d37f692566?w=500',
  },
  {
    id: '8',
    title: 'GoPro Hero 11 Black',
    price: '$449.99',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
  },
  {
    id: '9',
    title: 'Canon EOS R6 Camera',
    price: '$2,499',
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=500',
  },
  {
    id: '10',
    title: 'Beats Studio Pro Headphones',
    price: '$399.99',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
  },
  {
    id: '11',
    title: 'Dell XPS 15 Laptop',
    price: '$1,799',
    image: 'https://images.unsplash.com/photo-1588872657840-790ff3bde1c6?w=500',
  },
  {
    id: '12',
    title: 'Sony A7IV Mirrorless Camera',
    price: '$1,998',
    image: 'https://images.unsplash.com/photo-1606933248051-5ce98fdc1b13?w=500',
  },
  {
    id: '13',
    title: 'Asus ROG Gaming Laptop',
    price: '$1,499',
    image: 'https://images.unsplash.com/photo-1588872657840-790ff3bde1c6?w=500',
  },
  {
    id: '14',
    title: 'Apple AirPods Pro Max',
    price: '$549.99',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  },
  {
    id: '15',
    title: 'Google Pixel 8 Pro',
    price: '$999',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500',
  },
  {
    id: '16',
    title: 'iPhone 15 Pro Max',
    price: '$1,199',
    image: 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500',
  },
  {
    id: '17',
    title: 'Samsung 4K Smart TV 55 inch',
    price: '$699',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
  },
  {
    id: '18',
    title: 'Sony WH-CH720N Headphones',
    price: '$98',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
  },
  {
    id: '19',
    title: 'iPad Air 5th Generation',
    price: '$599',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
  },
  {
    id: '20',
    title: 'Garmin Smartwatch Series',
    price: '$399.99',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  },
];

export default function FlashSalesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 23, seconds: 19 });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'audio', label: 'Audio' },
    { id: 'cameras', label: 'Cameras' },
    { id: 'wearables', label: 'Wearables' },
  ];

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetails', { id: productId });
  };

  const renderProductGrid = () => {
    return (
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {allFlashSalesProducts.map((product) => (
            <View key={product.id} style={{ width: '48%' }}>
              <TouchableOpacity onPress={() => handleProductPress(product.id)}>
                <ProductCard
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  onPress={() => handleProductPress(product.id)}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Screen padded={false}>
      <TopBar title="Flash Sales" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Timer Banner */}
        <View style={{ paddingHorizontal: 16, marginTop: 12, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ color: '#121212', fontWeight: '700', fontSize: 14, marginBottom: 8 }}>
                Today's Flash Sale
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#121212', fontWeight: '700', fontSize: 12 }}>
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#121212', fontWeight: '700', fontSize: 12 }}>
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: 8,
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#121212', fontWeight: '700', fontSize: 12 }}>
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons name="flash" size={32} color="#121212" />
          </View>
        </View>

        {/* Filter Section */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>
              Category
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingHorizontal: 16 }}
            contentContainerStyle={{ gap: 10 }}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => setSelectedFilter(filter.id)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor:
                    selectedFilter === filter.id
                      ? colors.primary
                      : colors.border,
                  backgroundColor:
                    selectedFilter === filter.id
                      ? `${colors.primary}20`
                      : 'transparent',
                }}
              >
                <Text
                  style={{
                    color:
                      selectedFilter === filter.id
                        ? colors.primary
                        : colors.muted,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid */}
        {renderProductGrid()}

        {/* Footer Info */}
        <View style={{ paddingHorizontal: 16, marginVertical: 24, alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
              width: '100%',
            }}
          >
            <Text
              style={{
                color: colors.muted,
                fontSize: 12,
                textAlign: 'center',
                lineHeight: 18,
              }}
            >
              🔥 Limited time offers! Prices may change after the flash sale ends.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
