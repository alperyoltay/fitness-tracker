import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { useColorScheme, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { AnimatedSplashOverlay } from '../components/animated-icon';
import { LanguageProvider, LanguageToggle, useLanguage } from '../i18n/LanguageContext';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <TabLayout />
    </LanguageProvider>
  );
}

function TabLayout() {
  const { t } = useLanguage();
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
          headerRight: () => <LanguageToggle />,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t.tabSummary,
            headerTitle: t.tabSummaryHeader,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="workout"
          options={{
            title: t.tabWorkout,
            headerTitle: t.tabWorkoutHeader,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="barbell" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="nutrition"
          options={{
            title: t.tabNutrition,
            headerTitle: t.tabNutritionHeader,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="restaurant" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="budget"
          options={{
            title: t.tabBudget,
            headerTitle: t.tabBudgetHeader,
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
