import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AboutScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Screen padded={false}>
      <TopBar title="About" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* App Logo & Info */}
        <View style={{ alignItems: 'center', paddingVertical: 30, paddingHorizontal: 16 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 40 }}>🛍️</Text>
          </View>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
            ShopHub
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 20 }}>
            Version 1.0.0
          </Text>
          <Text
            style={{
              color: colors.muted,
              fontSize: 13,
              textAlign: 'center',
              lineHeight: 20,
            }}
          >
            Your ultimate destination for online shopping. Discover thousands of products at
            unbeatable prices with fast delivery.
          </Text>
        </View>

        {/* About Section */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            About ShopHub
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 13, lineHeight: 20, marginBottom: 12 }}>
              ShopHub is a modern e-commerce platform designed to provide you with the best
              shopping experience. We offer a wide range of products across various categories
              with competitive prices and excellent customer service.
            </Text>
            <Text style={{ color: colors.text, fontSize: 13, lineHeight: 20 }}>
              Our mission is to make online shopping convenient, affordable, and enjoyable for
              everyone. We're committed to delivering quality products and outstanding customer
              support.
            </Text>
          </View>
        </View>

        {/* Key Features */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Why Choose Us
          </Text>
          {[
            { icon: 'flash', title: 'Fast Delivery', desc: 'Quick and reliable shipping' },
            { icon: 'shield-checkmark', title: 'Secure Payment', desc: 'Safe and encrypted transactions' },
            { icon: 'undo', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: 'headset', title: '24/7 Support', desc: 'Always here to help' },
          ].map((feature, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 14,
                marginBottom: index !== 3 ? 10 : 0,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  backgroundColor: `${colors.primary}20`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name={feature.icon as any} size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 4 }}>
                  {feature.title}
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Social Links */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Follow Us
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              { icon: 'logo-facebook', label: 'Facebook' },
              { icon: 'logo-instagram', label: 'Instagram' },
              { icon: 'logo-twitter', label: 'Twitter' },
              { icon: 'logo-linkedin', label: 'LinkedIn' },
            ].map((social, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flex: 1,
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Ionicons
                  name={social.icon as any}
                  size={24}
                  color={colors.primary}
                  style={{ marginBottom: 4 }}
                />
                <Text style={{ color: colors.muted, fontSize: 10 }}>{social.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Legal */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Legal
          </Text>
          {[
            { title: 'Privacy Policy', icon: 'shield' },
            { title: 'Terms & Conditions', icon: 'document-text' },
            { title: 'Cookie Policy', icon: 'information-circle' },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.card,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginBottom: index !== 2 ? 10 : 0,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <Text style={{ flex: 1, color: colors.text, fontSize: 13, fontWeight: '600' }}>
                {item.title}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer */}
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 4 }}>
            © 2024 ShopHub. All rights reserved.
          </Text>
          <Text style={{ color: colors.muted, fontSize: 11 }}>Made with ❤️</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
