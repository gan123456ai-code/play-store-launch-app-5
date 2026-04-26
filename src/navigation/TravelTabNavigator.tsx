
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { FlightsStack } from './stacks/FlightsStack';
import { HotelsStack } from './stacks/HotelsStack';
import { TrainsStack } from './stacks/TrainsStack';
import { BookingsStack } from './stacks/BookingsStack';
import { SettingsStack } from './stacks/SettingsStack';

const Tab = createBottomTabNavigator();

export const TravelTabNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? theme.colors.surface : theme.colors.background,
          borderTopColor: theme.colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'airplane';
          if (route.name === 'Flights') iconName = focused ? 'airplane' : 'airplane-outline';
          else if (route.name === 'Hotels') iconName = focused ? 'bed' : 'bed-outline';
          else if (route.name === 'Trains') iconName = focused ? 'train' : 'train-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'More') iconName = focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal-circle-outline';
          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Flights" component={FlightsStack} />
      <Tab.Screen name="Hotels" component={HotelsStack} />
      <Tab.Screen name="Trains" component={TrainsStack} />
      <Tab.Screen name="Bookings" component={BookingsStack} />
      <Tab.Screen name="More" component={SettingsStack} />
    </Tab.Navigator>
  );
};
