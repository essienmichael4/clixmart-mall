import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const notificationsList = [
  {
    id: '1',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #1001 has been confirmed. Expected delivery: Nov 15, 2024',
    timestamp: '2 hours ago',
    icon: 'checkmark-circle',
    read: false,
  },
  {
    id: '2',
    type: 'delivery',
    title: 'Order Shipped',
    message: 'Your order #1000 has been shipped. Track your package now',
    timestamp: '5 hours ago',
    icon: 'send',
    read: false,
  },
  {
    id: '3',
    type: 'promo',
    title: '50% Off Flash Sale',
    message: 'Limited time offer! Get 50% off on electronics today only',
    timestamp: '1 day ago',
    icon: 'flash',
    read: true,
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Payment of $149.99 has been processed successfully',
    timestamp: '2 days ago',
    icon: 'wallet',
    read: true,
  },
  {
    id: '5',
    type: 'delivery',
    title: 'Delivered',
    message: 'Your order #999 has been delivered successfully',
    timestamp: '3 days ago',
    icon: 'checkmark-done-circle',
    read: true,
  },
  {
    id: '6',
    type: 'promo',
    title: 'New Coupon Available',
    message: 'You\'ve received a 30% discount coupon. Use code: HOLIDAY30',
    timestamp: '4 days ago',
    icon: 'ticket',
    read: true,
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [notifications, setNotifications] = useState(notificationsList);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return colors.primary;
      case 'delivery':
        return colors.success;
      case 'promo':
        return colors.warning;
      case 'payment':
        return colors.primary;
      default:
        return colors.muted;
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderNotification = ({ item }: { item: (typeof notificationsList)[0] }) => (
    <TouchableOpacity
      onPress={() => handleMarkAsRead(item.id)}
      style={{
        backgroundColor: item.read ? colors.card : `${colors.primary}15`,
        borderRadius: 12,
        marginBottom: 10,
        padding: 14,
        borderWidth: 1,
        borderColor: item.read ? colors.border : colors.primary,
        flexDirection: 'row',
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: `${getNotificationColor(item.type)}20`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          marginTop: 2,
        }}
      >
        <Ionicons
          name={item.icon as any}
          size={20}
          color={getNotificationColor(item.type)}
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 13,
              fontWeight: '700',
              flex: 1,
            }}
          >
            {item.title}
          </Text>
          {!item.read && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.primary,
                marginLeft: 8,
              }}
            />
          )}
        </View>
        <Text
          style={{
            color: colors.muted,
            fontSize: 12,
            lineHeight: 18,
            marginBottom: 6,
          }}
        >
          {item.message}
        </Text>
        <Text style={{ color: colors.muted, fontSize: 11 }}>
          {item.timestamp}
        </Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={() => handleDeleteNotification(item.id)}
        style={{ paddingLeft: 12 }}
      >
        <Ionicons name="close-circle" size={20} color={colors.muted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <Screen padded={false}>
      <TopBar title="Notifications" onBack={() => navigation.goBack()} />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Header */}
        {notifications.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              marginBottom: 12,
            }}
          >
            {unreadCount > 0 && (
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  backgroundColor: `${colors.primary}20`,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>
                  {unreadCount} new
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: 40,
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.card,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Ionicons name="notifications-off" size={40} color={colors.muted} />
            </View>
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 8,
              }}
            >
              No Notifications
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontSize: 13,
                textAlign: 'center',
                paddingHorizontal: 20,
              }}
            >
              You're all caught up! Come back later for new notifications.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
}