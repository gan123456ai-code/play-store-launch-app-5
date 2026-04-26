
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { AccountsStack } from './stacks/AccountsStack';
import { SendMoneyStack } from './stacks/SendMoneyStack';
import { BillsStack } from './stacks/BillsStack';
import { InvestmentsStack } from './stacks/InvestmentsStack';
import { SettingsStack } from './stacks/SettingsStack';

const Tab = createBottomTabNavigator();

export const BankingTabNavigator: React.FC = () => {
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
          let iconName: string = 'wallet';
          if (route.name === 'Accounts') iconName = focused ? 'wallet' : 'wallet-outline';
          else if (route.name === 'Send') iconName = focused ? 'send' : 'send-outline';
          else if (route.name === 'Bills') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'Invest') iconName = focused ? 'trending-up' : 'trending-up-outline';
          else if (route.name === 'More') iconName = focused ? 'ellipsis-horizontal-circle' : 'ellipsis-horizontal-circle-outline';
          return <Ionicons name={iconName as any} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Accounts" component={AccountsStack} />
      <Tab.Screen name="Send" component={SendMoneyStack} />
      <Tab.Screen name="Bills" component={BillsStack} />
      <Tab.Screen name="Invest" component={InvestmentsStack} />
      <Tab.Screen name="More" component={SettingsStack} />
    </Tab.Navigator>
  );
};
