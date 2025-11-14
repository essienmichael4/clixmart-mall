import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Screen from '../../components/Screen';
import { colors } from '../../theme/colors';
import { RootStackParamList, BottomTabParamList } from '../../navigation/RootNavigator';

type ProfileScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'Profile'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const menuItems = [
  { id: '1', label: 'Account Information', icon: 'person', screen: 'AccountInfo' },
  { id: '2', label: 'Payment Methods', icon: 'wallet', screen: 'PaymentMethod' },
  { id: '3', label: 'My Addresses', icon: 'location', screen: 'DeliveryAddress' },
  { id: '4', label: 'Notifications', icon: 'notifications', screen: 'Notifications' },
  { id: '5', label: 'Settings', icon: 'settings', screen: 'Language' },
  { id: '6', label: 'Help & Support', icon: 'help-circle', screen: 'HelpSupport' },
  { id: '7', label: 'About', icon: 'information-circle', screen: 'About' },
];

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleNavigation = (screen: string | null) => {
    if (screen) {
      navigation.navigate(screen as any);
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, alignItems: 'center' }}>
          {/* Profile Avatar */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>

          {/* User Info */}
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
            John Doe
          </Text>
          <Text style={{ color: colors.muted, fontSize: 13 }}>
            john.doe@example.com
          </Text>
        </View>

        {/* Stats Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
                12
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Total Orders</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
                3
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>In Progress</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '700', marginBottom: 4 }}>
                9
              </Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Account Settings
          </Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleNavigation(item.screen)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.card,
                paddingHorizontal: 14,
                paddingVertical: 14,
                borderRadius: 12,
                marginBottom: index !== menuItems.length - 1 ? 8 : 0,
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={20}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <Text style={{ flex: 1, color: colors.text, fontSize: 13, fontWeight: '600' }}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: `${colors.danger}20`,
              paddingHorizontal: 14,
              paddingVertical: 14,
              borderRadius: 12,
              justifyContent: 'center',
            }}
          >
            <Ionicons name="log-out" size={20} color={colors.danger} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.danger, fontSize: 13, fontWeight: '700' }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}