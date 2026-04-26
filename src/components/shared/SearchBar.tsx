
import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onSubmit,
  onClear,
  onFilterPress,
  showFilter = false,
  autoFocus = false,
}) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[
      styles.container,
      {
        backgroundColor: isDark ? theme.colors.surfaceElevated : theme.colors.surface,
        borderColor: theme.colors.border,
      },
      animatedStyle,
    ]}>
      <Ionicons name="search" size={20} color={theme.colors.textTertiary} style={styles.icon} />
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textTertiary}
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        returnKeyType="search"
        onFocus={() => { scale.value = withSpring(1.02, { damping: 15 }); }}
        onBlur={() => { scale.value = withSpring(1, { damping: 15 }); }}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => { haptics.light(); onClear?.(); onChangeText(''); }}>
          <Ionicons name="close-circle" size={20} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      )}
      {showFilter && (
        <TouchableOpacity onPress={() => { haptics.light(); onFilterPress?.(); }} style={styles.filterBtn}>
          <Ionicons name="options" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16 },
  filterBtn: { marginLeft: 8, padding: 4 },
});
