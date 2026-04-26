
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




const accountSectionItems = [
  { id: '0', title: 'Edit Profile', subtitle: 'Name, email, phone, avatar', icon: '👤', color: '#6366F1', value: '' },
  { id: '1', title: 'Security', subtitle: 'Password, biometric, 2FA', icon: '🔒', color: '#EF4444', value: '' },
  { id: '2', title: 'Privacy', subtitle: 'Data sharing, visibility', icon: '🛡️', color: '#10B981', value: '' },
];


const preferencesSectionItems = [
  { id: '0', title: 'Appearance', subtitle: 'Dark mode, themes, font size', icon: '🎨', color: '#8B5CF6', value: '' },
  { id: '1', title: 'Notifications', subtitle: 'Push, email, SMS alerts', icon: '🔔', color: '#F59E0B', value: '' },
  { id: '2', title: 'Language', subtitle: 'English, Hindi, Tamil, etc.', icon: '🌐', color: '#06B6D4', value: '' },
  { id: '3', title: 'Currency', subtitle: 'INR, USD, EUR, etc.', icon: '💱', color: '#EC4899', value: '' },
];


const supportSectionItems = [
  { id: '0', title: 'Help Center', subtitle: 'FAQs and support articles', icon: '❓', color: '#3B82F6', value: '' },
  { id: '1', title: 'Feedback', subtitle: 'Share your experience', icon: '💬', color: '#10B981', value: '' },
  { id: '2', title: 'About', subtitle: 'Version 2.0.0', icon: 'ℹ️', color: '#64748B', value: '' },
  { id: '3', title: 'Terms of Service', subtitle: 'Legal terms and conditions', icon: '📜', color: '#8B5CF6', value: '' },
  { id: '4', title: 'Privacy Policy', subtitle: 'How we handle your data', icon: '🔐', color: '#EF4444', value: '' },
];


export const SettingsHomeScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
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
  const tabs = [{ id: 'accountSection', label: 'Account' }, { id: 'preferencesSection', label: 'Preferences' }, { id: 'supportSection', label: 'Support' }];

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
            ⚙️ Settings & More
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
            placeholder="Search settings & more..."
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

        
        {/* Account Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>👤 Account</Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>Manage your account</Text>
            </View>
            <TouchableOpacity onPress={() => haptics.light()}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ paddingHorizontal: 16 }}>
            {accountSectionItems.map((item, idx) => (
              <Animated.View key={item.id} entering={FadeInRight.duration(400).delay(idx * 60)}>
                <GlassCard
                  onPress={() => { haptics.medium(); navigation.navigate('ProfileEdit'); }}
                  style={{ marginBottom: 10, padding: 14 }}
                >
                  <View style={styles.cardRow}>
                    <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                      <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
                      <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
                      {item.value ? <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.primary, marginTop: 4 }}>{item.value}</Text> : null}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </View>
          
        </Animated.View>
        

        {/* Preferences Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>🎨 Preferences</Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>Customize your experience</Text>
            </View>
            <TouchableOpacity onPress={() => haptics.light()}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ paddingHorizontal: 16 }}>
            {preferencesSectionItems.map((item, idx) => (
              <Animated.View key={item.id} entering={FadeInRight.duration(400).delay(idx * 60)}>
                <GlassCard
                  onPress={() => { haptics.medium(); navigation.navigate('SecuritySettings'); }}
                  style={{ marginBottom: 10, padding: 14 }}
                >
                  <View style={styles.cardRow}>
                    <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                      <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
                      <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
                      {item.value ? <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.primary, marginTop: 4 }}>{item.value}</Text> : null}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </View>
          
        </Animated.View>
        

        {/* Support Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>💬 Support</Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>Get help and support</Text>
            </View>
            <TouchableOpacity onPress={() => haptics.light()}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ paddingHorizontal: 16 }}>
            {supportSectionItems.map((item, idx) => (
              <Animated.View key={item.id} entering={FadeInRight.duration(400).delay(idx * 60)}>
                <GlassCard
                  onPress={() => { haptics.medium(); navigation.navigate('AppearanceSettings'); }}
                  style={{ marginBottom: 10, padding: 14 }}
                >
                  <View style={styles.cardRow}>
                    <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                      <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                    </View>
                    <View style={styles.cardContent}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{item.title}</Text>
                      <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
                      {item.value ? <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.primary, marginTop: 4 }}>{item.value}</Text> : null}
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
          </View>
          
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
