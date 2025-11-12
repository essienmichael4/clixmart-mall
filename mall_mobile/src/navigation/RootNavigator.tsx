import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import SplashScreen from '../screens/Splash/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegistrationScreen from '../screens/Auth/RegistrationScreen';
import ForgetPasswordScreen from '../screens/Auth/ForgetPasswordScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
import CreateNewPasswordScreen from '../screens/Auth/CreateNewPasswordScreen';
import PasswordUpdatedScreen from '../screens/Auth/PasswordUpdatedScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import CategoryScreen from '../screens/Category/CategoryScreen';
import CartScreen from '../screens/Cart/CartScreen';
import OrdersScreen from '../screens/Orders/OrdersScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ShopScreen from '../screens/Shop/ShopScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import ProductDetailsScreen from '../screens/Product/ProductDetailsScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import OrderDetailsScreen from '../screens/Orders/OrderDetailsScreen';
import OrderProgressScreen from '../screens/Orders/OrderProgressScreen';
import AccountInfoScreen from '../screens/Profile/AccountInfoScreen';
import PaymentMethodScreen from '../screens/Payments/PaymentMethodScreen';
import CardsScreen from '../screens/Payments/CardsScreen';
import DeliveryAddressScreen from '../screens/Address/DeliveryAddressScreen';
import MapScreen from '../screens/Address/MapScreen';
import CouponScreen from '../screens/Coupon/CouponScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import LanguageScreen from '../screens/Settings/LanguageScreen';
import HelpSupportScreen from '../screens/Profile/HelpSupportScreen';
import AboutScreen from '../screens/Profile/AboutScreen';
import FlashSalesScreen from '../screens/Home/FlashSalesScreen';
import ElectronicsScreen from '../screens/Category/ElectronicsScreen';
import GamesScreen from '../screens/Category/GamesScreen';
import MensFashionScreen from '../screens/Category/MensFashionScreen';
import KidsScreen from '../screens/Category/KidsScreen';
import WomensFashionScreen from '../screens/Category/WomensFashionScreen';
import PetsScreen from '../screens/Category/PetsScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Registration: undefined;
  ForgetPassword: undefined;
  OTP: undefined;
  CreateNewPassword: undefined;
  PasswordUpdated: undefined;
  HomeTabs: undefined;
  Shop: undefined;
  Search: undefined;
  Category: undefined;
  Electronics: undefined;
  Games: undefined;
  MensFashion: undefined;
  Kids: undefined;
  WomensFashion: undefined;
  Pets: undefined;
  ProductDetails: { id?: string };
  Checkout: undefined;
  Orders: undefined;
  OrderDetails: { id: string };
  OrderProgress: { id: string };
  Profile: undefined;
  AccountInfo: undefined;
  PaymentMethod: undefined;
  Cards: undefined;
  DeliveryAddress: undefined;
  Map: undefined;
  Cart: undefined;
  Coupon: undefined;
  Notifications: undefined;
  Language: undefined;
  HelpSupport: undefined;
  About: undefined;
  FlashSales: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  Category: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === 'Home'
              ? 'home'
              : route.name === 'Category'
              ? 'grid'
              : route.name === 'Cart'
              ? 'cart'
              : route.name === 'Orders'
              ? 'cube'
              : 'person';
          return <Ionicons name={name as any} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Category" component={CategoryScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    // Provide safe area context to all screens
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPasswordScreen} />
        <Stack.Screen name="PasswordUpdated" component={PasswordUpdatedScreen} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
        {/* Core app pages */}
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Electronics" component={ElectronicsScreen} />
        <Stack.Screen name="Games" component={GamesScreen} />
        <Stack.Screen name="MensFashion" component={MensFashionScreen} />
        <Stack.Screen name="Kids" component={KidsScreen} />
        <Stack.Screen name="WomensFashion" component={WomensFashionScreen} />
        <Stack.Screen name="Pets" component={PetsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        <Stack.Screen name="OrderProgress" component={OrderProgressScreen} />
        <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
        <Stack.Screen name="Cards" component={CardsScreen} />
        <Stack.Screen name="DeliveryAddress" component={DeliveryAddressScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Coupon" component={CouponScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="FlashSales" component={FlashSalesScreen} />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}