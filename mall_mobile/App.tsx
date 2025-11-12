import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';

// Minimal dark theme that matches the UI
const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0E0F10',
    card: '#0E0F10',
    text: '#FFFFFF',
    border: '#1A1B1E',
    primary: '#B6FF3B',
  },
};

export default function App() {
  return (
    <NavigationContainer theme={darkTheme}>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}
