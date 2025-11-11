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

const addresses = [
  {
    id: '1',
    type: 'Home',
    name: 'John\'s Home',
    address: '123 Main Street, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    isDefault: true,
  },
  {
    id: '2',
    type: 'Work',
    name: 'Office',
    address: '456 Business Avenue, New York, NY 10002',
    phone: '+1 (555) 987-6543',
    isDefault: false,
  },
  {
    id: '3',
    type: 'Other',
    name: 'Parent\'s Place',
    address: '789 Oak Street, Boston, MA 02101',
    phone: '+1 (555) 555-5555',
    isDefault: false,
  },
];

export default function DeliveryAddressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedAddressId, setSelectedAddressId] = useState(addresses.find((a) => a.isDefault)?.id);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    address: '',
    phone: '',
  });

  const handleAddAddress = () => {
    // Add new address logic
    setShowAddForm(false);
    setNewAddress({ type: 'Home', name: '', address: '', phone: '' });
  };

  const handleDeleteAddress = (id: string) => {
    // Delete address logic
  };

  return (
    <Screen padded={false}>
      <TopBar title="My Addresses" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
        {/* Saved Addresses */}
        <View style={{ marginBottom: 20, marginTop: 12 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Saved Addresses
          </Text>

          {addresses.map((addr, index) => (
            <TouchableOpacity
              key={addr.id}
              onPress={() => setSelectedAddressId(addr.id)}
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 14,
                marginBottom: index !== addresses.length - 1 ? 10 : 20,
                borderWidth: 2,
                borderColor: selectedAddressId === addr.id ? colors.primary : colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        backgroundColor: `${colors.primary}20`,
                        borderRadius: 6,
                        marginRight: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.primary,
                          fontSize: 11,
                          fontWeight: '700',
                        }}
                      >
                        {addr.type}
                      </Text>
                    </View>
                    {addr.isDefault && (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          backgroundColor: `${colors.success}20`,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: colors.success,
                            fontSize: 11,
                            fontWeight: '700',
                          }}
                        >
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
                    {addr.name}
                  </Text>
                  <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6, lineHeight: 18 }}>
                    {addr.address}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="call" size={14} color={colors.muted} style={{ marginRight: 6 }} />
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{addr.phone}</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => handleDeleteAddress(addr.id)}>
                  <Ionicons name="close-circle" size={24} color={colors.muted} />
                </TouchableOpacity>
              </View>

              {/* Edit & Set Default Buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.primary,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                {!addr.isDefault && (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: `${colors.primary}20`,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                      Set Default
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Address Section */}
        {!showAddForm ? (
          <TouchableOpacity
            onPress={() => setShowAddForm(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${colors.primary}20`,
              borderRadius: 12,
              paddingVertical: 16,
              marginBottom: 20,
              borderWidth: 2,
              borderColor: colors.primary,
              borderStyle: 'dashed',
            }}
          >
            <Ionicons name="add-circle" size={20} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>
              Add New Address
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 12 }}>
              Add New Address
            </Text>

            {/* Type Selection */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '600', marginBottom: 8 }}>
                Type
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {['Home', 'Work', 'Other'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setNewAddress({ ...newAddress, type })}
                    style={{
                      flex: 1,
                      paddingVertical: 8,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: newAddress.type === type ? colors.primary : colors.border,
                      backgroundColor:
                        newAddress.type === type ? `${colors.primary}20` : colors.bg,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: newAddress.type === type ? colors.primary : colors.text,
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Name Input */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>
                Address Label
              </Text>
              <TextInput
                value={newAddress.name}
                onChangeText={(val) => setNewAddress({ ...newAddress, name: val })}
                placeholder="e.g., My Home"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: colors.bg,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 13,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </View>

            {/* Address Input */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>
                Full Address
              </Text>
              <TextInput
                value={newAddress.address}
                onChangeText={(val) => setNewAddress({ ...newAddress, address: val })}
                placeholder="Enter your full address"
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={2}
                style={{
                  backgroundColor: colors.bg,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 13,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </View>

            {/* Phone Input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: colors.muted, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>
                Phone Number
              </Text>
              <TextInput
                value={newAddress.phone}
                onChangeText={(val) => setNewAddress({ ...newAddress, phone: val })}
                placeholder="Enter phone number"
                placeholderTextColor={colors.muted}
                keyboardType="phone-pad"
                style={{
                  backgroundColor: colors.bg,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: colors.text,
                  fontSize: 13,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              />
            </View>

            {/* Action Buttons */}
            <View style={{ gap: 10 }}>
              <ActionButton title="Save Address" onPress={handleAddAddress} />
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={{
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}