
import { useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useHaptics } from './useHaptics';

interface AnimatedPressConfig {
  scaleDown?: number;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  onPress?: () => void;
}

export const useAnimatedPress = (config: AnimatedPressConfig = {}) => {
  const { scaleDown = 0.96, hapticType = 'light', onPress } = config;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const haptics = useHaptics();

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(scaleDown, { damping: 15, stiffness: 200 });
    opacity.value = withTiming(0.85, { duration: 100 });
  }, [scaleDown]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 150 });
    if (hapticType === 'light') haptics.light();
    else if (hapticType === 'medium') haptics.medium();
    else if (hapticType === 'heavy') haptics.heavy();
    else haptics.selection();
    if (onPress) onPress();
  }, [hapticType, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    scale,
    opacity,
  };
};
