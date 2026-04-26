
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

interface NeumorphicCardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  borderRadius?: number;
  padding?: number;
  inset?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  style,
  onPress,
  borderRadius = 16,
  padding = 16,
  inset = false,
}) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    haptics.light();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const neumorphStyle: ViewStyle = {
    backgroundColor: isDark ? theme.colors.backgroundSecondary : theme.colors.surface,
    borderRadius,
    padding,
    shadowColor: isDark ? '#000000' : '#D1D9E6',
    shadowOffset: inset ? { width: -3, height: -3 } : { width: 6, height: 6 },
    shadowOpacity: isDark ? 0.5 : 1,
    shadowRadius: inset ? 6 : 12,
    elevation: inset ? 2 : 8,
  };

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[animatedStyle, neumorphStyle, style]}
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return (
    <Animated.View style={[animatedStyle, neumorphStyle, style]}>
      {children}
    </Animated.View>
  );
};
