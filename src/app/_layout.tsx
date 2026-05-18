import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { AnimatedSplashOverlay } from '../components/animated-icon';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme === 'dark' ? 'dark' : 'light'];

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#007AFF', // Clean Apple Blue
          tabBarInactiveTintColor: '#8E8E93', // Cool grey
          tabBarStyle: {
            backgroundColor: themeColors.background,
            borderTopWidth: 1,
            borderTopColor: themeColors.backgroundElement,
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
            paddingTop: 10,
          },
          headerStyle: {
            backgroundColor: themeColors.background,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.backgroundElement,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: themeColors.text,
          },
          headerTitleAlign: 'center',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Özet',
            headerTitle: 'Atletik Güç & Beslenme',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: 'Antrenman',
            headerTitle: 'Antrenman Takibi',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="barbell" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="nutrition"
          options={{
            title: 'Beslenme',
            headerTitle: 'Beslenme & Makrolar',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: 'Market & Stok',
            headerTitle: 'Market Harcaması & Cüzdan',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="wallet" size={size} color={color} />
            ),
          }}
        />
        {/* Hide default explore screen or any unused template paths */}
        <Tabs.Screen
          name="explore"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
