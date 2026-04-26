
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { TravelTabNavigator } from './TravelTabNavigator';
import { BankingTabNavigator } from './BankingTabNavigator';

export const RootNavigator: React.FC = () => {
  const { appMode } = useApp();
  const { theme, isDark } = useTheme();

  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {appMode === 'travel' ? <TravelTabNavigator /> : <BankingTabNavigator />}
    </NavigationContainer>
  );
};
