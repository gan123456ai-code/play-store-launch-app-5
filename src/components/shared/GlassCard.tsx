
import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  intensity?: number;
  borderRadius?: number;
  padding?: number;
  elevation?: boolean;
  animated?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  onPress,
  intensity = 20,
  borderRadius = 16,
  padding = 16,
  elevation = true,
  animated = true,
}) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);
  const shadowOpacity = useSharedValue(elevation ? 0.1 : 0);

  const handlePressIn = () => {
    if (animated) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
      shadowOpacity.value = withTiming(0.05, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (animated) {
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      shadowOpacity.value = withTiming(elevation ? 0.1 : 0, { duration: 200 });
    }
    haptics.light();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cardStyle: ViewStyle = {
    backgroundColor: isDark
      ? 'rgba(30, 41, 59, 0.65)'
      : 'rgba(255, 255, 255, 0.72)',
    borderRadius,
    padding,
    borderWidth: 1,
    borderColor: isDark
      ? 'rgba(148, 163, 184, 0.15)'
      : 'rgba(255, 255, 255, 0.25)',
    ...(elevation ? {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
    } : {}),
  };

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[animatedStyle, cardStyle, style]}
      >
        {children}
      </AnimatedTouchable>
    );
  }

  return (
    <Animated.View style={[animated ? animatedStyle : undefined, cardStyle, style]}>
      {children}
    </Animated.View>
  );
};
