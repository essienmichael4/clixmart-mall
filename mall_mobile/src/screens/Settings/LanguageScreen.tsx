import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const languages = [
  { id: '1', name: 'English', code: 'en', flag: '🇺🇸' },
  { id: '2', name: 'Spanish', code: 'es', flag: '🇪🇸' },
  { id: '3', name: 'French', code: 'fr', flag: '🇫🇷' },
  { id: '4', name: 'German', code: 'de', flag: '🇩🇪' },
  { id: '5', name: 'Italian', code: 'it', flag: '🇮🇹' },
  { id: '6', name: 'Portuguese', code: 'pt', flag: '🇵🇹' },
  { id: '7', name: 'Chinese', code: 'zh', flag: '🇨🇳' },
  { id: '8', name: 'Japanese', code: 'ja', flag: '🇯🇵' },
];

const settings = [
  { id: '1', label: 'Notifications', icon: 'notifications', enabled: true },
  { id: '2', label: 'Dark Mode', icon: 'moon', enabled: true },
  { id: '3', label: 'Push Notifications', icon: 'notifications-outline', enabled: true },
  { id: '4', label: 'Email Notifications', icon: 'mail', enabled: false },
  { id: '5', label: 'SMS Notifications', icon: 'phone-portrait', enabled: false },
];

export default function LanguageScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [appSettings, setAppSettings] = useState(settings);

  const toggleSetting = (id: string) => {
    setAppSettings(
      appSettings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <Screen padded={false}>
      <TopBar title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Language Section */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Language
          </Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 12 }}>
            Choose your preferred language
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.id}
                onPress={() => setSelectedLanguage(lang.code)}
                style={{
                  width: '48%',
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: selectedLanguage === lang.code ? colors.primary : colors.border,
                  backgroundColor:
                    selectedLanguage === lang.code ? `${colors.primary}20` : colors.card,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24, marginBottom: 6 }}>{lang.flag}</Text>
                <Text
                  style={{
                    color: selectedLanguage === lang.code ? colors.primary : colors.text,
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {lang.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Preferences Section */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            App Preferences
          </Text>

          {appSettings.map((setting, index) => (
            <View
              key={setting.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.card,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 14,
                marginBottom: index !== appSettings.length - 1 ? 10 : 0,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons
                name={setting.icon as any}
                size={20}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
              <Text style={{ flex: 1, color: colors.text, fontSize: 13, fontWeight: '600' }}>
                {setting.label}
              </Text>
              <TouchableOpacity
                onPress={() => toggleSetting(setting.id)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: setting.enabled ? colors.primary : colors.border,
                  alignItems: setting.enabled ? 'flex-end' : 'flex-start',
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}
              >
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.text,
                  }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* About App Section */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            App Information
          </Text>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>
              Version
            </Text>
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
              1.0.0
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>
              Last Updated
            </Text>
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
              November 11, 2024
            </Text>
          </View>
        </View>

        {/* Clear Cache Section */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: `${colors.danger}20`,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 14,
              borderWidth: 1,
              borderColor: `${colors.danger}40`,
            }}
          >
            <Ionicons name="trash" size={20} color={colors.danger} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.danger, fontSize: 13, fontWeight: '600' }}>
              Clear Cache
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}