
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import { gradientPresets } from '../../constants/theme';

export const ModeToggle: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { appMode, toggleAppMode } = useApp();
  const haptics = useHaptics();
  const translateX = useSharedValue(appMode === 'travel' ? 0 : 1);

  React.useEffect(() => {
    translateX.value = withSpring(appMode === 'travel' ? 0 : 1, { damping: 15, stiffness: 150 });
  }, [appMode]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 150 }],
  }));

  const handleToggle = () => {
    haptics.medium();
    toggleAppMode();
  };

  return (
    <View style={[styles.container, {
      backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary,
    }]}>
      <Animated.View style={[styles.slider, sliderStyle]}>
        <LinearGradient
          colors={appMode === 'travel' ? gradientPresets.travel : gradientPresets.banking}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.sliderGradient}
        />
      </Animated.View>
      <TouchableOpacity style={styles.option} onPress={handleToggle} activeOpacity={0.7}>
        <Text style={[styles.optionText, { color: appMode === 'travel' ? '#FFFFFF' : theme.colors.textSecondary }]}>
          ✈️ Travel
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={handleToggle} activeOpacity={0.7}>
        <Text style={[styles.optionText, { color: appMode === 'banking' ? '#FFFFFF' : theme.colors.textSecondary }]}>
          🏦 Banking
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 8,
    position: 'relative',
    height: 48,
  },
  slider: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 150,
    height: 40,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sliderGradient: {
    flex: 1,
    borderRadius: 12,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
