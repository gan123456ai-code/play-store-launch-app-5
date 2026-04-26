
import React, { ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

interface GradientBackgroundProps {
  children: ReactNode;
  colors?: string[];
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  colors,
  style,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}) => {
  const { theme, isDark } = useTheme();

  const defaultColors = isDark
    ? [theme.colors.background, theme.colors.backgroundSecondary, theme.colors.background]
    : [theme.colors.background, '#F0F4FF', theme.colors.background];

  return (
    <LinearGradient
      colors={colors || defaultColors}
      start={start}
      end={end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
