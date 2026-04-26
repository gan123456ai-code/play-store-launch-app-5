
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  RefreshControl, FlatList, TextInput, Dimensions,
  ActivityIndicator, Alert, Switch, Platform,
  KeyboardAvoidingView, Modal, Image,
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
  FloatingAIButton, EmptyState,
} from '../../components/shared';
import { gradientPresets } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const section0Items = Array.from({ length: 8 }, (_, idx) => ({
  id: `item_${idx}`,
  title: `Credit Factor ${idx + 1}`,
  subtitle: `Factor affecting your score`,
  description: `Detailed description for credit factor ${idx + 1}. This premium item offers exceptional quality and value. Features include top-rated service, verified reviews from thousands of users, competitive pricing with exclusive member discounts, and 24/7 customer support. Available across multiple locations with easy booking and instant confirmation. Rated ${(4 + Math.random()).toFixed(1)} stars by over ${100 + idx * 50} verified users.`,
  icon: ['📊', '📈', '📉', '🎯'][idx % 4],
  amount: 1000 + idx * 500,
  rating: Number((3.8 + (idx % 12) / 10).toFixed(1)),
  reviews: 50 + idx * 25,
  status: ['active', 'pending', 'completed', 'featured'][idx % 4],
  tags: ['Positive', 'Negative', 'Neutral'].slice(0, 2 + idx % 2),
  gradient: [''#10B981'', ''#34D399''],
  date: new Date(Date.now() - idx * 86400000).toISOString(),
  percentage: (5 + idx * 2).toFixed(1),
  progress: Math.min(1, 0.1 + idx * 0.08),
  featured: idx < 3,
  verified: idx % 3 === 0,
  trending: idx % 4 === 0,
  details: {
    line1: `Key detail: Premium quality credit factor with verified certifications`,
    line2: `Additional info: Available 24/7 with instant confirmation and support`,
    line3: `Note: Member exclusive pricing with loyalty points on every transaction`,
    stat1: { label: 'Rating', value: `${(4 + Math.random()).toFixed(1)}★` },
    stat2: { label: 'Users', value: `${(100 + idx * 50).toLocaleString()}` },
    stat3: { label: 'Savings', value: `₹${(200 + idx * 100).toLocaleString()}` },
  },
}));


const section1Items = Array.from({ length: 8 }, (_, idx) => ({
  id: `item_${idx}`,
  title: `Credit Card ${idx + 1}`,
  subtitle: `Recommended card offer`,
  description: `Detailed description for credit card ${idx + 1}. This premium item offers exceptional quality and value. Features include top-rated service, verified reviews from thousands of users, competitive pricing with exclusive member discounts, and 24/7 customer support. Available across multiple locations with easy booking and instant confirmation. Rated ${(4 + Math.random()).toFixed(1)} stars by over ${100 + idx * 50} verified users.`,
  icon: ['💳', '🏦', '⭐'][idx % 3],
  amount: 1000 + idx * 500,
  rating: Number((3.8 + (idx % 12) / 10).toFixed(1)),
  reviews: 50 + idx * 25,
  status: ['active', 'pending', 'completed', 'featured'][idx % 4],
  tags: ['Cashback', 'Travel', 'Fuel', 'Shopping'].slice(0, 2 + idx % 2),
  gradient: [''#6366F1'', ''#8B5CF6''],
  date: new Date(Date.now() - idx * 86400000).toISOString(),
  percentage: (5 + idx * 2).toFixed(1),
  progress: Math.min(1, 0.1 + idx * 0.08),
  featured: idx < 3,
  verified: idx % 3 === 0,
  trending: idx % 4 === 0,
  details: {
    line1: `Key detail: Premium quality credit card with verified certifications`,
    line2: `Additional info: Available 24/7 with instant confirmation and support`,
    line3: `Note: Member exclusive pricing with loyalty points on every transaction`,
    stat1: { label: 'Rating', value: `${(4 + Math.random()).toFixed(1)}★` },
    stat2: { label: 'Users', value: `${(100 + idx * 50).toLocaleString()}` },
    stat3: { label: 'Savings', value: `₹${(200 + idx * 100).toLocaleString()}` },
  },
}));


const section2Items = Array.from({ length: 6 }, (_, idx) => ({
  id: `item_${idx}`,
  title: `Loan Offer ${idx + 1}`,
  subtitle: `Pre-approved loan`,
  description: `Detailed description for loan offer ${idx + 1}. This premium item offers exceptional quality and value. Features include top-rated service, verified reviews from thousands of users, competitive pricing with exclusive member discounts, and 24/7 customer support. Available across multiple locations with easy booking and instant confirmation. Rated ${(4 + Math.random()).toFixed(1)} stars by over ${100 + idx * 50} verified users.`,
  icon: ['🏦', '🏠', '🚗', '📚'][idx % 4],
  amount: 50000 + idx * 100000,
  rating: Number((3.8 + (idx % 12) / 10).toFixed(1)),
  reviews: 50 + idx * 25,
  status: ['active', 'pending', 'completed', 'featured'][idx % 4],
  tags: ['Personal', 'Home', 'Car', 'Education'].slice(0, 2 + idx % 2),
  gradient: [''#EC4899'', ''#F472B6''],
  date: new Date(Date.now() - idx * 86400000).toISOString(),
  percentage: (5 + idx * 2).toFixed(1),
  progress: Math.min(1, 0.1 + idx * 0.08),
  featured: idx < 3,
  verified: idx % 3 === 0,
  trending: idx % 4 === 0,
  details: {
    line1: `Key detail: Premium quality loan offer with verified certifications`,
    line2: `Additional info: Available 24/7 with instant confirmation and support`,
    line3: `Note: Member exclusive pricing with loyalty points on every transaction`,
    stat1: { label: 'Rating', value: `${(4 + Math.random()).toFixed(1)}★` },
    stat2: { label: 'Users', value: `${(100 + idx * 50).toLocaleString()}` },
    stat3: { label: 'Savings', value: `₹${(200 + idx * 100).toLocaleString()}` },
  },
}));


export const CreditScoreScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite, addToHistory } = useApp();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200 + Math.random() * 600);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const tabs = [{"label":"Score","icon":"📊"},{"label":"Cards","icon":"💳"},{"label":"Loans","icon":"🏦"}];
  const sortOptions = ['default', 'price_low', 'price_high', 'rating', 'popular', 'newest'];

  return (
    <GradientBackground>
      <PremiumHeader title="Credit Score" subtitle="📊 Premium Experience" onBack={() => navigation.goBack()} transparent />

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Search */}
          <Animated.View entering={FadeInDown.duration(300)} style={{ paddingHorizontal: 16, marginBottom: 12 }}>
            <View style={[styles.searchBar, { backgroundColor: isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
              <Ionicons name="search" size={18} color={theme.colors.textTertiary} />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search..."
                placeholderTextColor={theme.colors.textTertiary}
              />
              <TouchableOpacity onPress={() => { haptics.light(); setShowFilter(!showFilter); }}>
                <Ionicons name="options-outline" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Tab Selector */}
          <Animated.View entering={FadeInDown.duration(300).delay(50)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 12 }}>
              {tabs.map((tab, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => { haptics.selection(); setSelectedTab(idx); }}
                  style={[styles.tab, { backgroundColor: selectedTab === idx ? theme.colors.primary : isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary }]}
                >
                  <Text style={{ fontSize: 14, fontWeight: '600', color: selectedTab === idx ? '#FFFFFF' : theme.colors.textSecondary }}>
                    {tab.icon} {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Sort */}
          {showFilter && (
            <Animated.View entering={FadeInDown.duration(200)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 12 }}>
                {sortOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => { haptics.selection(); setSortBy(opt); }}
                    style={[styles.sortChip, {
                      backgroundColor: sortBy === opt ? theme.colors.accent : 'transparent',
                      borderColor: sortBy === opt ? theme.colors.accent : theme.colors.border,
                    }]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '500', color: sortBy === opt ? '#FFFFFF' : theme.colors.textSecondary }}>
                      {opt.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {loading ? (
            <SkeletonList count={6} />
          ) : (
            <>
              
              {/* Score Analysis Section */}
              {selectedTab === 0 && (
                <>
                  {/* Featured Banner */}
                  <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                    <LinearGradient
                      colors={[''#10B981'', ''#34D399'']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.featuredBanner}
                    >
                      <Text style={styles.bannerEmoji}>📊</Text>
                      <Text style={styles.bannerTitle}>Your Credit Score: 785</Text>
                      <Text style={styles.bannerSubtitle}>Excellent - Top 15% of users</Text>
                      <View style={styles.bannerStats}>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>8+</Text>
                          <Text style={styles.bannerStatLabel}>Options</Text>
                        </View>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>4.5★</Text>
                          <Text style={styles.bannerStatLabel}>Avg Rating</Text>
                        </View>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>24/7</Text>
                          <Text style={styles.bannerStatLabel}>Support</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>

                  {/* Items List */}
                  <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                    <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📊 Score Analysis</Text>
                      <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>{section0Items.length} items</Text>
                    </View>

                    {section0Items.map((item, idx) => (
                      <Animated.View key={item.id} entering={FadeInDown.duration(300).delay(idx * 35)}>
                        <GlassCard
                          onPress={() => {
                            haptics.medium();
                            addToHistory(item.title);
                            setExpandedItem(expandedItem === item.id ? null : item.id);
                          }}
                          style={{ marginBottom: 10, padding: 14 }}
                        >
                          <View style={styles.cardRow}>
                            <LinearGradient colors={item.gradient} style={styles.cardIcon}>
                              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                            </LinearGradient>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <View style={styles.titleRow}>
                                <View style={{ flex: 1 }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.title}</Text>
                                    {item.verified && <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} style={{ marginLeft: 4 }} />}
                                    {item.trending && <Text style={{ fontSize: 10, marginLeft: 4 }}>🔥</Text>}
                                  </View>
                                  <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>{item.subtitle}</Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (isFavorite(item.id)) { removeFavorite(item.id); haptics.warning(); }
                                    else { addFavorite(item.id); haptics.success(); }
                                  }}
                                >
                                  <Ionicons name={isFavorite(item.id) ? 'heart' : 'heart-outline'} size={18} color={isFavorite(item.id) ? theme.colors.error : theme.colors.textTertiary} />
                                </TouchableOpacity>
                              </View>

                              {/* Tags */}
                              <View style={[styles.tagsRow, { marginTop: 6 }]}>
                                {item.tags.slice(0, 3).map((tag, tIdx) => (
                                  <View key={tIdx} style={[styles.tag, { backgroundColor: theme.colors.primary + '10' }]}>
                                    <Text style={{ fontSize: 10, color: theme.colors.primary, fontWeight: '500' }}>{tag}</Text>
                                  </View>
                                ))}
                                {item.featured && (
                                  <View style={[styles.tag, { backgroundColor: theme.colors.warning + '15' }]}>
                                    <Text style={{ fontSize: 10, color: theme.colors.warning, fontWeight: '600' }}>⭐ Featured</Text>
                                  </View>
                                )}
                              </View>

                              {/* Rating & Price */}
                              <View style={[styles.bottomRow, { marginTop: 8 }]}>
                                <View style={styles.ratingRow}>
                                  <Ionicons name="star" size={13} color="#F59E0B" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.text, marginLeft: 3 }}>{item.rating}</Text>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginLeft: 3 }}>({item.reviews})</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                  <Text style={[styles.priceText, { color: theme.colors.primary }]}>₹{item.amount.toLocaleString()}</Text>
                                  <Text style={{ fontSize: 10, color: theme.colors.success }}>Save {item.percentage}%</Text>
                                </View>
                              </View>

                              {/* Progress */}
                              <View style={[styles.progressBar, { backgroundColor: theme.colors.border, marginTop: 8 }]}>
                                <View style={[styles.progressFill, { width: `${Math.min(100, item.progress * 100)}%`, backgroundColor: theme.colors.primary }]} />
                              </View>
                            </View>
                          </View>

                          {/* Expanded */}
                          {expandedItem === item.id && (
                            <Animated.View entering={FadeInDown.duration(250)} style={[styles.expandedContent, { borderTopColor: theme.colors.divider }]}>
                              <Text style={{ fontSize: 13, color: theme.colors.text, lineHeight: 20, marginBottom: 12 }}>{item.description}</Text>

                              {/* Stats Grid */}
                              <View style={styles.statsGrid}>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.primary + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat1.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat1.value}</Text>
                                </View>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.success + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat2.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat2.value}</Text>
                                </View>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.accent + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat3.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat3.value}</Text>
                                </View>
                              </View>

                              {/* Detail Lines */}
                              <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>• {item.details.line1}</Text>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>• {item.details.line2}</Text>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>• {item.details.line3}</Text>
                              </View>

                              {/* Action Buttons */}
                              <View style={[styles.actionRow, { marginTop: 12 }]}>
                                <AnimatedButton title="View Details" onPress={() => haptics.medium()} variant="outline" size="small" style={{ flex: 1, marginRight: 8 }} />
                                <AnimatedButton title="Select" onPress={() => haptics.success()} variant="primary" size="small" style={{ flex: 1 }} />
                              </View>
                            </Animated.View>
                          )}
                        </GlassCard>
                      </Animated.View>
                    ))}
                  </View>
                </>
              )}
              

              {/* Credit Cards Section */}
              {selectedTab === 1 && (
                <>
                  {/* Featured Banner */}
                  <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                    <LinearGradient
                      colors={[''#6366F1'', ''#8B5CF6'']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.featuredBanner}
                    >
                      <Text style={styles.bannerEmoji}>💳</Text>
                      <Text style={styles.bannerTitle}>Best Credit Cards</Text>
                      <Text style={styles.bannerSubtitle}>Pre-approved offers for you</Text>
                      <View style={styles.bannerStats}>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>8+</Text>
                          <Text style={styles.bannerStatLabel}>Options</Text>
                        </View>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>4.5★</Text>
                          <Text style={styles.bannerStatLabel}>Avg Rating</Text>
                        </View>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>24/7</Text>
                          <Text style={styles.bannerStatLabel}>Support</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>

                  {/* Items List */}
                  <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                    <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>💳 Credit Cards</Text>
                      <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>{section1Items.length} items</Text>
                    </View>

                    {section1Items.map((item, idx) => (
                      <Animated.View key={item.id} entering={FadeInDown.duration(300).delay(idx * 35)}>
                        <GlassCard
                          onPress={() => {
                            haptics.medium();
                            addToHistory(item.title);
                            setExpandedItem(expandedItem === item.id ? null : item.id);
                          }}
                          style={{ marginBottom: 10, padding: 14 }}
                        >
                          <View style={styles.cardRow}>
                            <LinearGradient colors={item.gradient} style={styles.cardIcon}>
                              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                            </LinearGradient>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <View style={styles.titleRow}>
                                <View style={{ flex: 1 }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.title}</Text>
                                    {item.verified && <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} style={{ marginLeft: 4 }} />}
                                    {item.trending && <Text style={{ fontSize: 10, marginLeft: 4 }}>🔥</Text>}
                                  </View>
                                  <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>{item.subtitle}</Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (isFavorite(item.id)) { removeFavorite(item.id); haptics.warning(); }
                                    else { addFavorite(item.id); haptics.success(); }
                                  }}
                                >
                                  <Ionicons name={isFavorite(item.id) ? 'heart' : 'heart-outline'} size={18} color={isFavorite(item.id) ? theme.colors.error : theme.colors.textTertiary} />
                                </TouchableOpacity>
                              </View>

                              {/* Tags */}
                              <View style={[styles.tagsRow, { marginTop: 6 }]}>
                                {item.tags.slice(0, 3).map((tag, tIdx) => (
                                  <View key={tIdx} style={[styles.tag, { backgroundColor: theme.colors.primary + '10' }]}>
                                    <Text style={{ fontSize: 10, color: theme.colors.primary, fontWeight: '500' }}>{tag}</Text>
                                  </View>
                                ))}
                                {item.featured && (
                                  <View style={[styles.tag, { backgroundColor: theme.colors.warning + '15' }]}>
                                    <Text style={{ fontSize: 10, color: theme.colors.warning, fontWeight: '600' }}>⭐ Featured</Text>
                                  </View>
                                )}
                              </View>

                              {/* Rating & Price */}
                              <View style={[styles.bottomRow, { marginTop: 8 }]}>
                                <View style={styles.ratingRow}>
                                  <Ionicons name="star" size={13} color="#F59E0B" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.text, marginLeft: 3 }}>{item.rating}</Text>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginLeft: 3 }}>({item.reviews})</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                  <Text style={[styles.priceText, { color: theme.colors.primary }]}>₹{item.amount.toLocaleString()}</Text>
                                  <Text style={{ fontSize: 10, color: theme.colors.success }}>Save {item.percentage}%</Text>
                                </View>
                              </View>

                              {/* Progress */}
                              <View style={[styles.progressBar, { backgroundColor: theme.colors.border, marginTop: 8 }]}>
                                <View style={[styles.progressFill, { width: `${Math.min(100, item.progress * 100)}%`, backgroundColor: theme.colors.primary }]} />
                              </View>
                            </View>
                          </View>

                          {/* Expanded */}
                          {expandedItem === item.id && (
                            <Animated.View entering={FadeInDown.duration(250)} style={[styles.expandedContent, { borderTopColor: theme.colors.divider }]}>
                              <Text style={{ fontSize: 13, color: theme.colors.text, lineHeight: 20, marginBottom: 12 }}>{item.description}</Text>

                              {/* Stats Grid */}
                              <View style={styles.statsGrid}>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.primary + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat1.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat1.value}</Text>
                                </View>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.success + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat2.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat2.value}</Text>
                                </View>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.accent + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat3.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat3.value}</Text>
                                </View>
                              </View>

                              {/* Detail Lines */}
                              <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>• {item.details.line1}</Text>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>• {item.details.line2}</Text>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>• {item.details.line3}</Text>
                              </View>

                              {/* Action Buttons */}
                              <View style={[styles.actionRow, { marginTop: 12 }]}>
                                <AnimatedButton title="View Details" onPress={() => haptics.medium()} variant="outline" size="small" style={{ flex: 1, marginRight: 8 }} />
                                <AnimatedButton title="Select" onPress={() => haptics.success()} variant="primary" size="small" style={{ flex: 1 }} />
                              </View>
                            </Animated.View>
                          )}
                        </GlassCard>
                      </Animated.View>
                    ))}
                  </View>
                </>
              )}
              

              {/* Loans Section */}
              {selectedTab === 2 && (
                <>
                  {/* Featured Banner */}
                  <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                    <LinearGradient
                      colors={[''#EC4899'', ''#F472B6'']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.featuredBanner}
                    >
                      <Text style={styles.bannerEmoji}>🏦</Text>
                      <Text style={styles.bannerTitle}>Pre-approved Loans</Text>
                      <Text style={styles.bannerSubtitle}>Instant disbursement available</Text>
                      <View style={styles.bannerStats}>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>6+</Text>
                          <Text style={styles.bannerStatLabel}>Options</Text>
                        </View>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>4.5★</Text>
                          <Text style={styles.bannerStatLabel}>Avg Rating</Text>
                        </View>
                        <View style={styles.bannerStat}>
                          <Text style={styles.bannerStatValue}>24/7</Text>
                          <Text style={styles.bannerStatLabel}>Support</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>

                  {/* Items List */}
                  <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
                    <View style={styles.sectionHeader}>
                      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🏦 Loans</Text>
                      <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>{section2Items.length} items</Text>
                    </View>

                    {section2Items.map((item, idx) => (
                      <Animated.View key={item.id} entering={FadeInDown.duration(300).delay(idx * 35)}>
                        <GlassCard
                          onPress={() => {
                            haptics.medium();
                            addToHistory(item.title);
                            setExpandedItem(expandedItem === item.id ? null : item.id);
                          }}
                          style={{ marginBottom: 10, padding: 14 }}
                        >
                          <View style={styles.cardRow}>
                            <LinearGradient colors={item.gradient} style={styles.cardIcon}>
                              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                            </LinearGradient>
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <View style={styles.titleRow}>
                                <View style={{ flex: 1 }}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.title}</Text>
                                    {item.verified && <Ionicons name="checkmark-circle" size={14} color={theme.colors.success} style={{ marginLeft: 4 }} />}
                                    {item.trending && <Text style={{ fontSize: 10, marginLeft: 4 }}>🔥</Text>}
                                  </View>
                                  <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>{item.subtitle}</Text>
                                </View>
                                <TouchableOpacity
                                  onPress={() => {
                                    if (isFavorite(item.id)) { removeFavorite(item.id); haptics.warning(); }
                                    else { addFavorite(item.id); haptics.success(); }
                                  }}
                                >
                                  <Ionicons name={isFavorite(item.id) ? 'heart' : 'heart-outline'} size={18} color={isFavorite(item.id) ? theme.colors.error : theme.colors.textTertiary} />
                                </TouchableOpacity>
                              </View>

                              {/* Tags */}
                              <View style={[styles.tagsRow, { marginTop: 6 }]}>
                                {item.tags.slice(0, 3).map((tag, tIdx) => (
                                  <View key={tIdx} style={[styles.tag, { backgroundColor: theme.colors.primary + '10' }]}>
                                    <Text style={{ fontSize: 10, color: theme.colors.primary, fontWeight: '500' }}>{tag}</Text>
                                  </View>
                                ))}
                                {item.featured && (
                                  <View style={[styles.tag, { backgroundColor: theme.colors.warning + '15' }]}>
                                    <Text style={{ fontSize: 10, color: theme.colors.warning, fontWeight: '600' }}>⭐ Featured</Text>
                                  </View>
                                )}
                              </View>

                              {/* Rating & Price */}
                              <View style={[styles.bottomRow, { marginTop: 8 }]}>
                                <View style={styles.ratingRow}>
                                  <Ionicons name="star" size={13} color="#F59E0B" />
                                  <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.text, marginLeft: 3 }}>{item.rating}</Text>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginLeft: 3 }}>({item.reviews})</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                  <Text style={[styles.priceText, { color: theme.colors.primary }]}>₹{item.amount.toLocaleString()}</Text>
                                  <Text style={{ fontSize: 10, color: theme.colors.success }}>Save {item.percentage}%</Text>
                                </View>
                              </View>

                              {/* Progress */}
                              <View style={[styles.progressBar, { backgroundColor: theme.colors.border, marginTop: 8 }]}>
                                <View style={[styles.progressFill, { width: `${Math.min(100, item.progress * 100)}%`, backgroundColor: theme.colors.primary }]} />
                              </View>
                            </View>
                          </View>

                          {/* Expanded */}
                          {expandedItem === item.id && (
                            <Animated.View entering={FadeInDown.duration(250)} style={[styles.expandedContent, { borderTopColor: theme.colors.divider }]}>
                              <Text style={{ fontSize: 13, color: theme.colors.text, lineHeight: 20, marginBottom: 12 }}>{item.description}</Text>

                              {/* Stats Grid */}
                              <View style={styles.statsGrid}>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.primary + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat1.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat1.value}</Text>
                                </View>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.success + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat2.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat2.value}</Text>
                                </View>
                                <View style={[styles.statBox, { backgroundColor: theme.colors.accent + '08' }]}>
                                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.details.stat3.label}</Text>
                                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{item.details.stat3.value}</Text>
                                </View>
                              </View>

                              {/* Detail Lines */}
                              <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>• {item.details.line1}</Text>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 }}>• {item.details.line2}</Text>
                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>• {item.details.line3}</Text>
                              </View>

                              {/* Action Buttons */}
                              <View style={[styles.actionRow, { marginTop: 12 }]}>
                                <AnimatedButton title="View Details" onPress={() => haptics.medium()} variant="outline" size="small" style={{ flex: 1, marginRight: 8 }} />
                                <AnimatedButton title="Select" onPress={() => haptics.success()} variant="primary" size="small" style={{ flex: 1 }} />
                              </View>
                            </Animated.View>
                          )}
                        </GlassCard>
                      </Animated.View>
                    ))}
                  </View>
                </>
              )}
              
            </>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <FloatingAIButton />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 15, marginHorizontal: 10 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  sortChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, borderWidth: 1 },
  featuredBanner: { marginHorizontal: 16, borderRadius: 20, padding: 20, alignItems: 'center' },
  bannerEmoji: { fontSize: 36, marginBottom: 8 },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  bannerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  bannerStats: { flexDirection: 'row', marginTop: 16 },
  bannerStat: { alignItems: 'center', marginHorizontal: 16 },
  bannerStatValue: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  bannerStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 15, fontWeight: '600' },
  cardSubtitle: { fontSize: 12, marginTop: 2 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginRight: 6, marginBottom: 2 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  priceText: { fontSize: 16, fontWeight: '700' },
  progressBar: { height: 3, borderRadius: 1.5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 1.5 },
  expandedContent: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1, padding: 10, borderRadius: 10, marginHorizontal: 3, alignItems: 'center' },
  actionRow: { flexDirection: 'row' },
});
