
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


const currenciesData = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  title: `Currency ${i + 1}`,
  subtitle: `Select display currency`,
  description: `Currency ${i + 1}. This includes comprehensive details about pricing, availability, features, amenities, and user reviews. Each item has been carefully curated to provide the best experience for our premium users.`,
  icon: ['💰', '💵', '💶', '💷'][i % 4],
  price: 0 + (i * 500),
  originalPrice: 1000 + (i * 500),
  rating: (3.5 + (i % 15) / 10).toFixed(1),
  reviews: 50 + i * 30,
  tags: ['Popular', 'All'],
  features: [],
  gradient: ['#6366F1', '#8B5CF6'],
  status: ['available', 'limited', 'popular', 'new'][i % 4],
  discount: Math.floor(Math.random() * 30 + 5),
  location: ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Goa', 'Jaipur'][i % 8],
  date: `2025-01-${String(10 + i).padStart(2, '0')}`,
  time: `${6 + i % 12}:${i % 2 === 0 ? '00' : '30'}`,
  category: ['Popular', 'Asia', 'Europe'][i % 3],
  amount: 0 + (i * 500),
  imageEmoji: ['💰', '💵', '💶', '💷'][i % 4],
  details: {
    info1: 'Detail information line 1 for item ' + (i + 1),
    info2: 'Detail information line 2 for item ' + (i + 1),
    info3: 'Detail information line 3 for item ' + (i + 1),
  },
}));




export const CurrencySettingsScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
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

  const filters = ['all', 'popular', 'asia', 'europe'];
  const tabs = [{ id: 'overview', label: 'Overview' }, { id: 'details', label: 'Details' }, { id: 'reviews', label: 'Reviews' }];

  const isHomeScreen = !route?.params;

  return (
    <GradientBackground>
      
      <PremiumHeader
        title="Currency"
        subtitle="View details"
        onBack={() => navigation.goBack()}
        transparent
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 12 }}>
          {tabs.map((tab, idx) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => { haptics.selection(); setSelectedTab(idx); }}
              style={{
                paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8,
                backgroundColor: selectedTab === idx ? theme.colors.primary : isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: selectedTab === idx ? '#FFFFFF' : theme.colors.textSecondary }}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <SkeletonList count={5} />
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            
            {currenciesData.map((item, index) => (
              <Animated.View key={item.id} entering={FadeInDown.duration(400).delay(index * 60)}>
                <GlassCard
                  onPress={() => { haptics.medium();  }}
                  style={{ marginBottom: 12, padding: 16 }}
                >
                  <View style={styles.cardRow}>
                    <LinearGradient
                      colors={item.gradient}
                      style={{ width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Text style={{ fontSize: 22 }}>{item.imageEmoji}</Text>
                    </LinearGradient>
                    <View style={[styles.cardContent, { marginLeft: 14 }]}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.title}</Text>
                      <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={2}>{item.subtitle}</Text>
                      <View style={[styles.spaceBetween, { marginTop: 8 }]}>
                        <View style={styles.row}>
                          <Ionicons name="star" size={14} color="#F59E0B" />
                          <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.text, marginLeft: 4 }}>{item.rating}</Text>
                        </View>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.primary }}>₹{item.price.toLocaleString()}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
            
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
