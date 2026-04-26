
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: () => void;
  rightIcon?: string;
  gradientColors?: string[];
  large?: boolean;
  transparent?: boolean;
}

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  title,
  subtitle,
  onBack,
  rightAction,
  rightIcon = 'ellipsis-horizontal',
  gradientColors,
  large = false,
  transparent = false,
}) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const backScale = useSharedValue(1);

  const backAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backScale.value }],
  }));

  const handleBack = () => {
    haptics.light();
    backScale.value = withSpring(0.85, { damping: 15 }, () => {
      backScale.value = withSpring(1, { damping: 12 });
    });
    onBack?.();
  };

  if (transparent) {
    return (
      <View style={[styles.transparentContainer, { paddingTop: insets.top + 8 }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        {onBack && (
          <Animated.View style={backAnimStyle}>
            <TouchableOpacity onPress={handleBack} style={[styles.backBtn, { backgroundColor: theme.colors.glassBg }]}>
              <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </Animated.View>
        )}
        <View style={styles.titleContainer}>
          <Text style={[large ? styles.largeTitle : styles.title, { color: theme.colors.text }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
        </View>
        {rightAction && (
          <TouchableOpacity onPress={() => { haptics.light(); rightAction(); }} style={[styles.backBtn, { backgroundColor: theme.colors.glassBg }]}>
            <Ionicons name={rightIcon as any} size={22} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors || [theme.colors.gradient1Start, theme.colors.gradient1End]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradientContainer, { paddingTop: insets.top + 8 }]}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.row}>
        {onBack && (
          <Animated.View style={backAnimStyle}>
            <TouchableOpacity onPress={handleBack} style={styles.gradientBackBtn}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        )}
        <View style={styles.titleContainer}>
          <Text style={[large ? styles.largeTitle : styles.title, { color: '#FFFFFF' }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.8)' }]}>{subtitle}</Text>}
        </View>
        {rightAction && (
          <TouchableOpacity onPress={() => { haptics.light(); rightAction(); }} style={styles.gradientBackBtn}>
            <Ionicons name={rightIcon as any} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  transparentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  gradientContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  largeTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});
