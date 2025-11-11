import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const screenSizes = ['32 inch', '40 inch', '44 inch', '50 inch', '55 inch', '70 inch'];

export default function ProductDetailsScreen({ navigation, route }: Props) {
  const [selectedSize, setSelectedSize] = useState('32 inch');
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top Bar with Image and Icons */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>Product Details</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Product Image */}
          <View style={{ backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600' }}
              style={{ width: '100%', height: 250 }}
            />
          </View>

          {/* Favorite and Share Icons */}
          <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'flex-end', marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setIsFavorite(!isFavorite)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.card,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? colors.danger : colors.muted}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.card,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="share-social" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Product Title and Price */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
              Smart LED TV 32 inch with 43LM6300
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 12 }}>
              FHD...
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '700' }}>$1,700</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="star" size={16} color={colors.primary} />
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>4.5</Text>
              </View>
            </View>
          </View>

          {/* Screen Size Selection */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
              screen Size
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {screenSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: selectedSize === size ? colors.primary : colors.card,
                  }}
                >
                  <Text
                    style={{
                      color: selectedSize === size ? '#121212' : colors.text,
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>Description</Text>
              <TouchableOpacity>
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>See more</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
              Smart LED TV 32 inch With Built-in Receiver, 2 HDMI and 2 USB inputs 32E1500E Black - WE…
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
        <ActionButton
          title="Add to cart"
          icon={
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#121212',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="add" size={20} color={colors.primary} />
            </View>
          }
          onPress={() => {
            // Add to cart logic
            console.log('Added to cart:', { product: route.params?.id, quantity, size: selectedSize });
          }}
        />
      </View>
    </Screen>
  );
}