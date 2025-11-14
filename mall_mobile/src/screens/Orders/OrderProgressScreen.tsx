import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import ActionButton from '../../components/ActionButton';
import { colors } from '../../theme/colors';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  icon: string;
}

const mockTimeline: TimelineStep[] = [
  {
    id: '1',
    title: 'Order Confirmed',
    description: 'Your order has been confirmed and is being processed',
    timestamp: 'Nov 10, 2024 - 2:30 PM',
    completed: true,
    icon: 'checkmark-circle',
  },
  {
    id: '2',
    title: 'Packed',
    description: 'Your items are being packed for shipment',
    timestamp: 'Nov 11, 2024 - 10:15 AM',
    completed: true,
    icon: 'cube',
  },
  {
    id: '3',
    title: 'Shipped',
    description: 'Your package is on the way',
    timestamp: 'Nov 11, 2024 - 3:45 PM',
    completed: true,
    icon: 'send',
  },
  {
    id: '4',
    title: 'Out for Delivery',
    description: 'Your package is out for delivery today',
    timestamp: 'Nov 12, 2024 - 9:00 AM (Expected)',
    completed: false,
    icon: 'navigate',
  },
  {
    id: '5',
    title: 'Delivered',
    description: 'Your package has been delivered',
    timestamp: 'Nov 12, 2024 (Expected)',
    completed: false,
    icon: 'home',
  },
];

export default function OrderProgressScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [timeline, setTimeline] = useState<TimelineStep[]>(mockTimeline);
  const [currentProgress, setCurrentProgress] = useState(60);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setCurrentProgress((prev) => {
        if (prev < 100) return prev + Math.random() * 10;
        return 100;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const completedSteps = timeline.filter((step) => step.completed).length;
  const totalSteps = timeline.length;

  return (
    <Screen padded={false}>
      <TopBar title="Track Order" onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
        {/* Order Number */}
        <View style={{ marginTop: 12, marginBottom: 20 }}>
          <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 6 }}>
            Order Number
          </Text>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>
            #1001
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              height: 8,
              backgroundColor: colors.card,
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${Math.min(currentProgress, 100)}%`,
                backgroundColor: colors.primary,
                borderRadius: 4,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
              {completedSteps} of {totalSteps} Completed
            </Text>
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>
              {Math.round(currentProgress)}%
            </Text>
          </View>
        </View>

        {/* Current Status Card */}
        <View
          style={{
            backgroundColor: `${colors.primary}15`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: colors.primary,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="information-circle" size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>
              Current Status
            </Text>
          </View>
          <Text style={{ color: colors.text, fontSize: 13, lineHeight: 20 }}>
            Your package is on the way! It will be out for delivery on November 12, 2024.
          </Text>
        </View>

        {/* Timeline */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 16 }}>
            Delivery Timeline
          </Text>

          {timeline.map((step, index) => (
            <View key={step.id} style={{ marginBottom: 20 }}>
              {/* Timeline Item */}
              <View style={{ flexDirection: 'row' }}>
                {/* Left connector and dot */}
                <View style={{ alignItems: 'center', marginRight: 16, width: 40 }}>
                  {/* Dot */}
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: step.completed ? colors.primary : colors.card,
                      borderWidth: 2,
                      borderColor: step.completed ? colors.primary : colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <Ionicons
                      name={step.icon as any}
                      size={20}
                      color={step.completed ? colors.bg : colors.muted}
                    />
                  </View>

                  {/* Vertical line connector (not on last item) */}
                  {index !== timeline.length - 1 && (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        backgroundColor: timeline[index + 1]?.completed ? colors.primary : colors.border,
                      }}
                    />
                  )}
                </View>

                {/* Content */}
                <View
                  style={{
                    flex: 1,
                    paddingRight: 12,
                    paddingTop: 4,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: step.completed ? colors.card : `${colors.primary}15`,
                      borderRadius: 12,
                      padding: 14,
                      borderWidth: 1,
                      borderColor: step.completed ? colors.border : colors.primary,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700', flex: 1 }}>
                        {step.title}
                      </Text>
                      {step.completed && (
                        <View
                          style={{
                            backgroundColor: colors.success,
                            borderRadius: 6,
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                          }}
                        >
                          <Text style={{ color: colors.bg, fontSize: 10, fontWeight: '700' }}>
                            DONE
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={{
                        color: colors.muted,
                        fontSize: 12,
                        lineHeight: 18,
                        marginBottom: 8,
                      }}
                    >
                      {step.description}
                    </Text>
                    <Text style={{ color: colors.muted, fontSize: 11 }}>
                      {step.timestamp}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 12 }}>
            Delivery Address
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>
              John Doe
            </Text>
            <Text
              style={{
                color: colors.muted,
                fontSize: 12,
                lineHeight: 18,
                marginBottom: 12,
              }}
            >
              123 Main Street, Apt 4B{'\n'}New York, NY 10001{'\n'}United States
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: colors.border,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.primary,
                }}
              >
                <Ionicons name="call" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                  Call
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: `${colors.primary}20`,
                }}
              >
                <Ionicons name="location" size={16} color={colors.primary} style={{ marginRight: 6 }} />
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                  Map
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Estimated Delivery */}
        <View style={{ marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: `${colors.primary}20`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="calendar" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 11, marginBottom: 4 }}>
                Estimated Delivery
              </Text>
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>
                November 12, 2024
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Support */}
        <View style={{ marginBottom: 24 }}>
          <ActionButton
            title="Contact Support"
            onPress={() => navigation.navigate('HelpSupport')}
          />
        </View>

        {/* Back to Orders */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            paddingVertical: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 13, fontWeight: '600' }}>
            Back to Orders
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}