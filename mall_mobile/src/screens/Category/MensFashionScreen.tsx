import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../../components/Screen';
import { colors } from '../../theme/colors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { getProductsByCategory } from '../../data/products';

type Props = NativeStackScreenProps<RootStackParamList, "MensFashion">;

export default function MensFashionScreen({ navigation }: Props) {
  const products = getProductsByCategory("Men's Fashion");

  const renderProductCard = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductDetails', { id: item.id })}
      style={{
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        gap: 12,
      }}
    >
      {/* Product Image Placeholder */}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 8,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="image" size={40} color={colors.muted} />
      </View>

      {/* Product Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
          {item.name}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 8 }}>
          {item.description}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '700' }}>
            ${item.price.toFixed(2)}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="star" size={14} color={colors.primary} />
            <Text style={{ color: colors.text, fontSize: 12 }}>
              {item.rating} ({item.reviews})
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen padded={false}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.card,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ flex: 1, color: colors.text, fontSize: 18, fontWeight: '700' }}>
          Men's Fashion
        </Text>
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 }}
        scrollIndicatorInsets={{ right: 1 }}
      />
    </Screen>
  );
}
