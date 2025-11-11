import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const faqs = [
  {
    id: '1',
    question: 'How do I track my order?',
    answer: 'You can track your order by going to Orders section and clicking on the order you want to track. You\'ll see real-time updates on your delivery status.',
  },
  {
    id: '2',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. If you\'re not satisfied with your purchase, contact our support team to initiate a return.',
  },
  {
    id: '3',
    question: 'How can I update my delivery address?',
    answer: 'Go to Profile > My Addresses to add, edit, or delete your delivery addresses. Make sure to set a default address before checkout.',
  },
  {
    id: '4',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit cards (Visa, Mastercard), debit cards, digital wallets, and bank transfers. All payments are securely processed.',
  },
  {
    id: '5',
    question: 'How do I apply a coupon code?',
    answer: 'During checkout, you\'ll find a coupon code field. Enter your coupon code and click apply to see the discount on your total.',
  },
];

export default function HelpSupportScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Screen padded={false}>
      <TopBar title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* FAQs Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Frequently Asked Questions
          </Text>

          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              onPress={() => toggleExpand(faq.id)}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                marginBottom: 10,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                }}
              >
                <Ionicons
                  name="help-circle"
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 12 }}
                />
                <Text style={{ flex: 1, color: colors.text, fontSize: 13, fontWeight: '600' }}>
                  {faq.question}
                </Text>
                <Ionicons
                  name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.muted}
                />
              </View>

              {expandedId === faq.id && (
                <View
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    backgroundColor: `${colors.primary}10`,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 12, lineHeight: 18 }}>
                    {faq.answer}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20, borderTopWidth: 1, borderTopColor: colors.border }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Contact Support
          </Text>

          {/* Email */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="mail" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>Email</Text>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
                support@ecommerce.com
              </Text>
            </View>
          </TouchableOpacity>

          {/* Phone */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="call" size={20} color={colors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>Phone</Text>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
                +1 (555) 987-6543
              </Text>
            </View>
          </TouchableOpacity>

          {/* Live Chat */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 14,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons
              name="chatbubble"
              size={20}
              color={colors.primary}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>Live Chat</Text>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
                Available 24/7
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Message Form */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Send us a Message
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: 14,
              paddingVertical: 12,
              minHeight: 120,
              marginBottom: 12,
            }}
          >
            <TextInput
              value={contactMessage}
              onChangeText={setContactMessage}
              placeholder="Write your message here..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={5}
              style={{ color: colors.text, fontSize: 13 }}
            />
          </View>
          <ActionButton title="Send Message" onPress={() => setContactMessage('')} />
        </View>
      </ScrollView>
    </Screen>
  );
}
