import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  title: string;
  price: string;
  image: string;
  onPress?: () => void;
};

export default function ProductCard({ title, price, image, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: 200 }}>
      <View style={{ backgroundColor: colors.card, borderRadius: 16, overflow: 'hidden' }}>
        <Image source={{ uri: image }} style={{ width: '100%', height: 120 }} />
        <View style={{ padding: 12, gap: 6 }}>
          <Text style={{ color: colors.text, fontWeight: '600' }} numberOfLines={1}>
            {title}
          </Text>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>{price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}