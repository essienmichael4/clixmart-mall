import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AccountInfoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '15/06/1990',
    gender: 'Male',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically send the data to your backend
  };

  return (
    <Screen padded={false}>
      <TopBar
        title="Account Information"
        onBack={() => navigation.goBack()}
        rightIcon={isEditing ? 'close' : 'create'}
        onRightPress={() => setIsEditing(!isEditing)}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
        {/* Profile Avatar */}
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 50 }}>👤</Text>
          </View>
          {isEditing && (
            <TouchableOpacity style={{ marginTop: 8 }}>
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '600' }}>
                Change Photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Form Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Personal Information
          </Text>

          {/* First Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
              First Name
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {isEditing ? (
                <TextInput
                  value={formData.firstName}
                  onChangeText={(val) => handleInputChange('firstName', val)}
                  style={{ color: colors.text, fontSize: 13 }}
                  placeholderTextColor={colors.muted}
                />
              ) : (
                <Text style={{ color: colors.text, fontSize: 13 }}>{formData.firstName}</Text>
              )}
            </View>
          </View>

          {/* Last Name */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
              Last Name
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {isEditing ? (
                <TextInput
                  value={formData.lastName}
                  onChangeText={(val) => handleInputChange('lastName', val)}
                  style={{ color: colors.text, fontSize: 13 }}
                  placeholderTextColor={colors.muted}
                />
              ) : (
                <Text style={{ color: colors.text, fontSize: 13 }}>{formData.lastName}</Text>
              )}
            </View>
          </View>

          {/* Email */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
              Email Address
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {isEditing ? (
                <TextInput
                  value={formData.email}
                  onChangeText={(val) => handleInputChange('email', val)}
                  style={{ color: colors.text, fontSize: 13 }}
                  placeholderTextColor={colors.muted}
                  keyboardType="email-address"
                />
              ) : (
                <Text style={{ color: colors.text, fontSize: 13 }}>{formData.email}</Text>
              )}
            </View>
          </View>

          {/* Phone */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
              Phone Number
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {isEditing ? (
                <TextInput
                  value={formData.phone}
                  onChangeText={(val) => handleInputChange('phone', val)}
                  style={{ color: colors.text, fontSize: 13 }}
                  placeholderTextColor={colors.muted}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={{ color: colors.text, fontSize: 13 }}>{formData.phone}</Text>
              )}
            </View>
          </View>

          {/* Date of Birth */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
              Date of Birth
            </Text>
            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              {isEditing ? (
                <TextInput
                  value={formData.dateOfBirth}
                  onChangeText={(val) => handleInputChange('dateOfBirth', val)}
                  style={{ color: colors.text, fontSize: 13 }}
                  placeholderTextColor={colors.muted}
                  placeholder="DD/MM/YYYY"
                />
              ) : (
                <Text style={{ color: colors.text, fontSize: 13 }}>{formData.dateOfBirth}</Text>
              )}
            </View>
          </View>

          {/* Gender */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
              Gender
            </Text>
            {isEditing ? (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {['Male', 'Female', 'Other'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleInputChange('gender', option)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: formData.gender === option ? colors.primary : colors.border,
                      backgroundColor:
                        formData.gender === option ? `${colors.primary}20` : colors.card,
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: formData.gender === option ? colors.primary : colors.text,
                        fontWeight: '600',
                        fontSize: 12,
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 13 }}>{formData.gender}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <View style={{ marginBottom: 20 }}>
            <ActionButton title="Save Changes" onPress={handleSave} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}