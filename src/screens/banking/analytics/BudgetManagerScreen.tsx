
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  RefreshControl, FlatList, TextInput, Dimensions,
  ActivityIndicator, Switch, StatusBar, Modal,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  FadeInDown, FadeInUp, FadeInRight, ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import {
  GradientBackground, GlassCard, NeumorphicCard,
  SkeletonLoader, SkeletonList, AnimatedButton,
  PremiumHeader, FloatingAIButton, EmptyState,
} from '../../components/shared';
import { gradientPresets } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const card0Data = {
  title: 'Monthly Budget',
  value: '₹1,00,000',
  change: 'On Track',
  changePositive: true,
  subtitle: '68.5% used this month',
  icon: '🎯',
  gradient: ['#6366F1', '#8B5CF6'],
  stats: [
    
  ],
};



const chart0Data = Array.from({ length: 8 }, (_, idx) => ({
  label: ['Food', 'Rent', 'Transport', 'Shopping', 'Bills', 'Health', 'Fun', 'Other'][idx % 12],
  value: 5000 + Math.floor(Math.random() * 15000),
  previousValue: 5000 + Math.floor(Math.random() * 15000),
  color: ['#EC4899', '#6366F1', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#64748B'][idx % 8],
  percentage: Math.floor(Math.random() * 100),
}));



const list0Data = Array.from({ length: 8 }, (_, idx) => ({
  id: String(idx + 1),
  title: `Budget ${idx + 1}`,
  subtitle: `Monthly budget allocation`,
  description: `This is a comprehensive description for budget ${idx + 1}. It contains all relevant details about pricing, features, availability, reviews, and everything else that premium users need to make informed decisions. Our platform provides the best experience with top-notch quality and reliability. Each item is carefully curated for maximum value and satisfaction.`,
  icon: ['🍔', '🏠', '🚗', '🛍️', '⚡', '🏥', '🎭', '📱'][idx % 8],
  value: '₹' + (5000 + idx * 5000).toLocaleString(),
  amount: 5000 + idx * 5000,
  rating: (3.5 + (idx % 15) / 10).toFixed(1),
  reviews: 50 + idx * 30,
  status: ['active', 'pending', 'completed', 'expired'][idx % 4],
  trend: idx % 2 === 0 ? 'up' : 'down',
  trendValue: (Math.random() * 20).toFixed(1),
  tags: ['On Track', 'Exceeded', 'Under'],
  features: ['80% used', '50% used'],
  gradient: ['#6366F1', '#8B5CF6'],
  date: `2025-01-${String(10 + idx).padStart(2, '0')}`,
  time: `${6 + idx % 12}:${idx % 2 === 0 ? '00' : '30'} ${idx % 2 === 0 ? 'AM' : 'PM'}`,
  category: ['Food', 'Rent', 'Transport', 'Shopping', 'Bills'][idx % 5],
  percentage: (5 + idx * 2.5).toFixed(1),
  progress: (0.2 + idx * 0.05).toFixed(2),
  metrics: {
    views: 100 + idx * 50,
    clicks: 20 + idx * 10,
    conversions: 5 + idx * 2,
    revenue: (1000 + idx * 500).toLocaleString(),
  },
}));


export const BudgetManagerScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite, addToHistory } = useApp();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const periods = ['1D', '1W', '1M', '3M', '6M', '1Y', 'All'];
  const tabs = ['Overview', 'Analytics', 'Breakdown', 'History'];

  return (
    <GradientBackground>
      <PremiumHeader
        title="Budget Manager"
        subtitle="🎯 Dashboard & Analytics"
        onBack={() => navigation.goBack()}
        transparent
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <SkeletonList count={8} />
        ) : (
          <>
            {/* Period Selector */}
            <Animated.View entering={FadeInDown.duration(400)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 16 }}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period}
                    onPress={() => { haptics.selection(); setSelectedPeriod(period); }}
                    style={[styles.periodChip, {
                      backgroundColor: selectedPeriod === period ? theme.colors.primary : 'transparent',
                      borderColor: selectedPeriod === period ? theme.colors.primary : theme.colors.border,
                    }]}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '600', color: selectedPeriod === period ? '#FFFFFF' : theme.colors.textSecondary }}>{period}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>

            {/* Summary Cards */}
            
            <Animated.View entering={FadeInDown.duration(400).delay(0)}>
              <TouchableOpacity
                onPress={() => { haptics.medium(); setExpandedCard(expandedCard === 0 ? null : 0); }}
                activeOpacity={0.9}
                style={{ marginHorizontal: 16, marginBottom: 12 }}
              >
                <LinearGradient
                  colors={card0Data.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.summaryCard}
                >
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardIcon}>{card0Data.icon}</Text>
                      <Text style={styles.cardLabel}>{card0Data.title}</Text>
                      <Text style={styles.cardValue}>{card0Data.value}</Text>
                    </View>
                    <View style={styles.changeContainer}>
                      <Ionicons name={card0Data.changePositive ? 'trending-up' : 'trending-down'} size={18} color={card0Data.changePositive ? '#4ADE80' : '#FB7185'} />
                      <Text style={[styles.changeText, { color: card0Data.changePositive ? '#4ADE80' : '#FB7185' }]}>{card0Data.change}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubtitle}>{card0Data.subtitle}</Text>

                  {/* Expanded Stats */}
                  {expandedCard === 0 && card0Data.stats.length > 0 && (
                    <Animated.View entering={FadeInDown.duration(300)} style={styles.statsRow}>
                      {card0Data.stats.map((stat, sIdx) => (
                        <View key={sIdx} style={styles.statItem}>
                          <Text style={styles.statIcon}>{stat.icon}</Text>
                          <Text style={styles.statValue}>{stat.value}</Text>
                          <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                      ))}
                    </Animated.View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            

            {/* Tab Bar */}
            <Animated.View entering={FadeInDown.duration(400).delay(80)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 16 }}>
                {tabs.map((tab, idx) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => { haptics.selection(); setSelectedTab(idx); }}
                    style={[styles.tab, { backgroundColor: selectedTab === idx ? theme.colors.primary : isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary }]}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: selectedTab === idx ? '#FFFFFF' : theme.colors.textSecondary }}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>

            
            {/* Budget Utilization */}
            <Animated.View entering={FadeInDown.duration(400).delay(80)}>
              <GlassCard style={{ marginHorizontal: 16, marginBottom: 16, padding: 16 }} animated={false}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12 }}>Budget Utilization</Text>
                {/* Visual Chart Bars */}
                <View style={styles.chartContainer}>
                  {chart0Data.map((point, pIdx) => {
                    const maxVal = Math.max(...chart0Data.map(d => d.value));
                    const height = (point.value / maxVal) * 120;
                    return (
                      <TouchableOpacity key={pIdx} style={styles.chartBarWrap} onPress={() => { haptics.light(); }}>
                        <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginBottom: 4 }}>{Math.round(point.value / 1000)}k</Text>
                        <View style={[styles.chartBar, { height, backgroundColor: point.color + '40' }]}>
                          <View style={[styles.chartBarFill, { height: height * 0.7, backgroundColor: point.color }]} />
                        </View>
                        <Text style={{ fontSize: 9, color: theme.colors.textTertiary, marginTop: 4 }}>{point.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {/* Legend */}
                <View style={[styles.legendRow, { marginTop: 12 }]}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.colors.primary }]} />
                    <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>Current Period</Text>
                  </View>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: theme.colors.primary + '40' }]} />
                    <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>Previous Period</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
            

            
            {/* Category Budgets List */}
            <Animated.View entering={FadeInDown.duration(400).delay(160)}>
              <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📊 Category Budgets</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>Manage spending limits</Text>
                  </View>
                  <TouchableOpacity onPress={() => haptics.light()}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>View All</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ paddingHorizontal: 16 }}>
                {list0Data.map((item, idx) => (
                  <Animated.View key={item.id} entering={FadeInDown.duration(300).delay(idx * 30)}>
                    <GlassCard
                      onPress={() => {
                        haptics.medium();
                        addToHistory(item.title);
                      }}
                      style={{ marginBottom: 10, padding: 14 }}
                    >
                      <View style={styles.listRow}>
                        <LinearGradient
                          colors={item.gradient}
                          style={styles.listIcon}
                        >
                          <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                        </LinearGradient>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <View style={styles.listTitleRow}>
                            <Text style={[styles.listTitle, { color: theme.colors.text }]} numberOfLines={1}>{item.title}</Text>
                            <TouchableOpacity onPress={() => {
                              if (isFavorite(item.id)) { removeFavorite(item.id); haptics.warning(); }
                              else { addFavorite(item.id); haptics.success(); }
                            }}>
                              <Ionicons name={isFavorite(item.id) ? 'heart' : 'heart-outline'} size={16} color={isFavorite(item.id) ? theme.colors.error : theme.colors.textTertiary} />
                            </TouchableOpacity>
                          </View>
                          <Text style={[styles.listSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>{item.subtitle}</Text>
                          <View style={[styles.listTagRow, { marginTop: 6 }]}>
                            {item.tags.slice(0, 2).map((tag, tIdx) => (
                              <View key={tIdx} style={[styles.listTag, { backgroundColor: theme.colors.primary + '10' }]}>
                                <Text style={{ fontSize: 10, color: theme.colors.primary, fontWeight: '500' }}>{tag}</Text>
                              </View>
                            ))}
                            <View style={[styles.listTag, { backgroundColor: item.trend === 'up' ? theme.colors.success + '15' : theme.colors.error + '15' }]}>
                              <Ionicons name={item.trend === 'up' ? 'trending-up' : 'trending-down'} size={10} color={item.trend === 'up' ? theme.colors.success : theme.colors.error} />
                              <Text style={{ fontSize: 10, color: item.trend === 'up' ? theme.colors.success : theme.colors.error, marginLeft: 3 }}>{item.trendValue}%</Text>
                            </View>
                          </View>
                          <View style={[styles.listBottomRow, { marginTop: 6 }]}>
                            <View style={styles.ratingContainer}>
                              <Ionicons name="star" size={12} color="#F59E0B" />
                              <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.text, marginLeft: 3 }}>{item.rating}</Text>
                              <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginLeft: 3 }}>({item.reviews})</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.primary }}>{item.value}</Text>
                              <Text style={{ fontSize: 10, color: item.trend === 'up' ? theme.colors.success : theme.colors.error }}>
                                {item.trend === 'up' ? '↑' : '↓'} {item.trendValue}%
                              </Text>
                            </View>
                          </View>
                          {/* Progress Bar */}
                          <View style={[styles.progressBar, { backgroundColor: theme.colors.border, marginTop: 8 }]}>
                            <View style={[styles.progressFill, { width: item.progress * 100 + '%', backgroundColor: theme.colors.primary }]} />
                          </View>
                          <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginTop: 3 }}>
                            {item.date} • {item.time} • {item.category}
                          </Text>
                        </View>
                      </View>
                    </GlassCard>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
            

            
            {/* Quick Actions */}
            <Animated.View entering={FadeInDown.duration(400).delay(240)} style={{ paddingHorizontal: 16, marginBottom: 16 }}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 12 }]}>⚡ Quick Actions</Text>
              <View style={styles.actionsGrid}>
                
                <TouchableOpacity
                  onPress={() => { haptics.medium(); }}
                  style={[styles.actionCard, { backgroundColor: isDark ? theme.colors.surfaceElevated : theme.colors.card, borderColor: theme.colors.border }]}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.actionIconBg}>
                    <Text style={{ fontSize: 20 }}>✏️</Text>
                  </LinearGradient>
                  <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Edit</Text>
                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary, textAlign: 'center' }}>Budgets</Text>
                </TouchableOpacity>
                

                <TouchableOpacity
                  onPress={() => { haptics.medium(); }}
                  style={[styles.actionCard, { backgroundColor: isDark ? theme.colors.surfaceElevated : theme.colors.card, borderColor: theme.colors.border }]}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#EF4444', '#F87171']} style={styles.actionIconBg}>
                    <Text style={{ fontSize: 20 }}>🔔</Text>
                  </LinearGradient>
                  <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Alerts</Text>
                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary, textAlign: 'center' }}>Set up</Text>
                </TouchableOpacity>
                

                <TouchableOpacity
                  onPress={() => { haptics.medium(); }}
                  style={[styles.actionCard, { backgroundColor: isDark ? theme.colors.surfaceElevated : theme.colors.card, borderColor: theme.colors.border }]}
                  activeOpacity={0.85}
                >
                  <LinearGradient colors={['#10B981', '#34D399']} style={styles.actionIconBg}>
                    <Text style={{ fontSize: 20 }}>📊</Text>
                  </LinearGradient>
                  <Text style={[styles.actionLabel, { color: theme.colors.text }]}>History</Text>
                  <Text style={{ fontSize: 10, color: theme.colors.textTertiary, textAlign: 'center' }}>Past</Text>
                </TouchableOpacity>
                
              </View>
            </Animated.View>
            
          </>
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
  periodChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  summaryCard: { borderRadius: 20, padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardLabel: { fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  cardValue: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginTop: 4 },
  cardSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
  changeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  changeText: { fontSize: 13, fontWeight: '700', marginLeft: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  statItem: { alignItems: 'center' },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 140, paddingHorizontal: 4 },
  chartBarWrap: { alignItems: 'center', flex: 1 },
  chartBar: { width: '60%', borderRadius: 6, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' },
  chartBarFill: { width: '100%', borderRadius: 6 },
  legendRow: { flexDirection: 'row', justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  listRow: { flexDirection: 'row', alignItems: 'flex-start' },
  listIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  listTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listTitle: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  listSubtitle: { fontSize: 12, marginTop: 2 },
  listTagRow: { flexDirection: 'row', flexWrap: 'wrap' },
  listTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginRight: 6 },
  listBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  actionCard: { width: (SCREEN_WIDTH - 48) / 3, margin: 4, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1 },
  actionIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
});
