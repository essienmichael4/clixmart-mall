import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import { colors } from '../../theme/colors';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabParamList, RootStackParamList } from '../../navigation/RootNavigator';

type Props = BottomTabScreenProps<BottomTabParamList, 'Category'>;
type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

const categories = [
  { id: '1', name: 'Electronics', count: '10k Products', icon: 'laptop' },
  { id: '2', name: 'Games', count: '8k Products', icon: 'game-controller' },
  { id: '3', name: "Men's Fashion", count: '10k Products', icon: 'shirt' },
  { id: '4', name: 'Kids', count: '20k Products', icon: 'happy' },
  { id: '5', name: "Woman's Fashion", count: '23k Products', icon: 'woman' },
  { id: '6', name: 'Pets', count: '5k Products', icon: 'paw' },
];

export default function CategoryScreen({ navigation }: Props) {
  const rootNavigation = useNavigation<RootNavigation>();
  
  return (
    <Screen padded={false}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <TouchableOpacity
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
          Categories
        </Text>
      </View>

      {/* Categories List */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => {
                console.log('Navigate to', category.name);
                if (category.name === 'Electronics') {
                  rootNavigation.navigate('Electronics');
                } else if (category.name === 'Games') {
                  rootNavigation.navigate('Games');
                } else if (category.name === "Men's Fashion") {
                  rootNavigation.navigate('MensFashion');
                } else if (category.name === 'Kids') {
                  rootNavigation.navigate('Kids');
                } else if (category.name === "Woman's Fashion") {
                  rootNavigation.navigate('WomensFashion');
                } else if (category.name === 'Pets') {
                  rootNavigation.navigate('Pets');
                }
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 12,
                backgroundColor: colors.card,
                borderRadius: 12,
                marginBottom: index !== categories.length - 1 ? 12 : 20,
              }}
            >
              {/* Category Icon */}
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: colors.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 24 }}>
                  {category.icon === 'laptop'
                    ? '💻'
                    : category.icon === 'game-controller'
                    ? '🎮'
                    : category.icon === 'shirt'
                    ? '👕'
                    : category.icon === 'happy'
                    ? '😊'
                    : category.icon === 'woman'
                    ? '👗'
                    : '🐾'}
                </Text>
              </View>

              {/* Category Info */}
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 4 }}>
                  {category.name}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {category.count}
                </Text>
              </View>

              {/* Chevron Arrow */}
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}