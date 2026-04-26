
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  RefreshControl, FlatList, TextInput, Dimensions, Image,
  ActivityIndicator, Alert, Switch, Platform, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  withSequence, withDelay, interpolate, FadeInDown, FadeInUp,
  FadeInRight, SlideInRight, ZoomIn, Layout,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import {
  GradientBackground, GlassCard, NeumorphicCard,
  SkeletonLoader, SkeletonCard, SkeletonList,
  AnimatedButton, PremiumHeader, SearchBar,
  FloatingAIButton, EmptyState, ModeToggle,
} from '../../components/shared';
import { gradientPresets } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');





export const ScanQRScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { appMode, toggleAppMode, isFavorite, addFavorite, removeFavorite, addToHistory } = useApp();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200 + Math.random() * 800);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const onLoadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoadingMore(false);
    }, 1000);
  }, [loadingMore]);

  const filters = ['all', 'general'];
  const tabs = [{ id: 'overview', label: 'Overview' }, { id: 'details', label: 'Details' }, { id: 'reviews', label: 'Reviews' }];

  const isHomeScreen = true;

  return (
    <GradientBackground>
      
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y + nativeEvent.layoutMeasurement.height >= nativeEvent.contentSize.height - 100) {
            onLoadMore();
          }
        }}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(600)} style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: theme.colors.text }}>
            📷 Scan QR
          </Text>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 }}>
            Explore premium options tailored just for you
          </Text>
        </Animated.View>

        {/* Mode Toggle */}
        <Animated.View entering={FadeInDown.duration(600).delay(50)}>
          <ModeToggle />
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search scan qr..."
            showFilter
            onFilterPress={() => { haptics.light(); setShowFilters(!showFilters); }}
          />
        </Animated.View>

        {/* Filter Chips */}
        <Animated.View entering={FadeInDown.duration(600).delay(150)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 12 }}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => { haptics.selection(); setSelectedFilter(filter); }}
                style={{
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8,
                  backgroundColor: selectedFilter === filter ? theme.colors.primary : 'transparent',
                  borderWidth: 1,
                  borderColor: selectedFilter === filter ? theme.colors.primary : theme.colors.border,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '500', color: selectedFilter === filter ? '#FFFFFF' : theme.colors.textSecondary }}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        

        {/* Main Items List */}
        

        {/* Loading More Indicator */}
        {loadingMore && (
          <View style={{ paddingVertical: 16, alignItems: 'center' }}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 6 }}>Loading more...</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      

      <FloatingAIButton />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, marginTop: 2 },
  spaceBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  bigIcon: { fontSize: 32 },
});
