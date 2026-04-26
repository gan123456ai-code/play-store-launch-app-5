
/**
 * Animation utility functions for TravelBank Ultra
 */
import { withSpring, withTiming, withSequence, withDelay, Easing } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export const SPRING_CONFIGS = {
  gentle: { damping: 15, stiffness: 150, mass: 1 },
  bouncy: { damping: 8, stiffness: 200, mass: 0.5 },
  smooth: { damping: 20, stiffness: 100, mass: 1 },
  snappy: { damping: 25, stiffness: 300, mass: 0.8 },
  wobbly: { damping: 5, stiffness: 180, mass: 0.5 },
  stiff: { damping: 30, stiffness: 400, mass: 1 },
} as const;

export const TIMING_CONFIGS = {
  fast: { duration: 150, easing: Easing.out(Easing.cubic) },
  normal: { duration: 300, easing: Easing.inOut(Easing.cubic) },
  slow: { duration: 500, easing: Easing.inOut(Easing.cubic) },
  linear: { duration: 300, easing: Easing.linear },
} as const;

export const animateScale = (scale: SharedValue<number>, toValue: number, config: keyof typeof SPRING_CONFIGS = 'gentle') => {
  'worklet';
  scale.value = withSpring(toValue, SPRING_CONFIGS[config]);
};

export const animateOpacity = (opacity: SharedValue<number>, toValue: number, duration: number = 300) => {
  'worklet';
  opacity.value = withTiming(toValue, { duration });
};

export const animateTranslateY = (translateY: SharedValue<number>, toValue: number, config: keyof typeof SPRING_CONFIGS = 'gentle') => {
  'worklet';
  translateY.value = withSpring(toValue, SPRING_CONFIGS[config]);
};

export const animateTranslateX = (translateX: SharedValue<number>, toValue: number, config: keyof typeof SPRING_CONFIGS = 'gentle') => {
  'worklet';
  translateX.value = withSpring(toValue, SPRING_CONFIGS[config]);
};

export const animateRotate = (rotation: SharedValue<number>, toValue: number, duration: number = 300) => {
  'worklet';
  rotation.value = withTiming(toValue, { duration });
};

export const bounceIn = (scale: SharedValue<number>) => {
  'worklet';
  scale.value = withSequence(
    withTiming(0.3, { duration: 0 }),
    withSpring(1.1, SPRING_CONFIGS.bouncy),
    withSpring(1, SPRING_CONFIGS.gentle)
  );
};

export const pulseAnimation = (scale: SharedValue<number>) => {
  'worklet';
  scale.value = withSequence(
    withSpring(1.05, SPRING_CONFIGS.gentle),
    withSpring(1, SPRING_CONFIGS.gentle)
  );
};

export const shakeAnimation = (translateX: SharedValue<number>) => {
  'worklet';
  translateX.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-8, { duration: 50 }),
    withTiming(8, { duration: 50 }),
    withTiming(-4, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
};

export const slideInFromRight = (translateX: SharedValue<number>) => {
  'worklet';
  translateX.value = withSequence(
    withTiming(300, { duration: 0 }),
    withSpring(0, SPRING_CONFIGS.smooth)
  );
};

export const slideInFromBottom = (translateY: SharedValue<number>) => {
  'worklet';
  translateY.value = withSequence(
    withTiming(500, { duration: 0 }),
    withSpring(0, SPRING_CONFIGS.smooth)
  );
};

export const fadeInUp = (opacity: SharedValue<number>, translateY: SharedValue<number>, delay: number = 0) => {
  'worklet';
  opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
  translateY.value = withDelay(delay, withSpring(0, SPRING_CONFIGS.gentle));
};

export const staggeredFadeIn = (items: Array<{ opacity: SharedValue<number>; translateY: SharedValue<number> }>, staggerDelay: number = 80) => {
  'worklet';
  items.forEach((item, index) => {
    fadeInUp(item.opacity, item.translateY, index * staggerDelay);
  });
};

export const flipAnimation = (rotateY: SharedValue<number>) => {
  'worklet';
  rotateY.value = withSequence(
    withTiming(180, { duration: 300, easing: Easing.inOut(Easing.cubic) }),
    withTiming(360, { duration: 300, easing: Easing.inOut(Easing.cubic) })
  );
};

export default {
  SPRING_CONFIGS,
  TIMING_CONFIGS,
  animateScale,
  animateOpacity,
  animateTranslateY,
  animateTranslateX,
  animateRotate,
  bounceIn,
  pulseAnimation,
  shakeAnimation,
  slideInFromRight,
  slideInFromBottom,
  fadeInUp,
  staggeredFadeIn,
  flipAnimation,
};
