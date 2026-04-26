
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


const recentTransfersData = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  title: `Transfer to ${i + 1}`,
  subtitle: `Recent money transfer`,
  description: `Transfer ${i + 1}. This includes comprehensive details about pricing, availability, features, amenities, and user reviews. Each item has been carefully curated to provide the best experience for our premium users.`,
  icon: ['👤', '👩', '👨', '🏦'][i % 4],
  price: 500 + (i * 1000),
  originalPrice: 1500 + (i * 1000),
  rating: (3.5 + (i % 15) / 10).toFixed(1),
  reviews: 50 + i * 30,
  tags: ['UPI', 'NEFT', 'IMPS'],
  features: ['Instant', 'Scheduled'],
  gradient: [''#059669'', ''#10B981''],
  status: ['available', 'limited', 'popular', 'new'][i % 4],
  discount: Math.floor(Math.random() * 30 + 5),
  location: ['New Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Kolkata', 'Hyderabad', 'Goa', 'Jaipur'][i % 8],
  date: `2025-01-${String(10 + i).padStart(2, '0')}`,
  time: `${6 + i % 12}:${i % 2 === 0 ? '00' : '30'}`,
  category: ['UPI', 'Bank Transfer', 'Wallet'][i % 3],
  amount: 500 + (i * 1000),
  imageEmoji: ['👤', '👩', '👨', '🏦'][i % 4],
  details: {
    info1: 'Detail information line 1 for item ' + (i + 1),
    info2: 'Detail information line 2 for item ' + (i + 1),
    info3: 'Detail information line 3 for item ' + (i + 1),
  },
}));



const frequentContactsItems = [
  { id: '0', title: 'Priya', subtitle: 'Last: ₹5,000', icon: '👩', color: '#EC4899', value: 'UPI' },
  { id: '1', title: 'Amit', subtitle: 'Last: ₹2,500', icon: '👨', color: '#6366F1', value: 'UPI' },
  { id: '2', title: 'Sneha', subtitle: 'Last: ₹1,200', icon: '👩', color: '#10B981', value: 'Bank' },
  { id: '3', title: 'Rajesh', subtitle: 'Last: ₹3,000', icon: '👨', color: '#F59E0B', value: 'UPI' },
  { id: '4', title: 'Kavita', subtitle: 'Last: ₹800', icon: '👩', color: '#8B5CF6', value: 'UPI' },
];


const sendOptionsItems = [
  { id: '0', title: 'UPI / VPA', subtitle: 'Send using UPI ID instantly', icon: '📱', color: '#10B981', value: '' },
  { id: '1', title: 'Bank Transfer', subtitle: 'NEFT / IMPS / RTGS', icon: '🏦', color: '#6366F1', value: '' },
  { id: '2', title: 'Scan QR Code', subtitle: 'Scan any UPI QR code', icon: '📷', color: '#8B5CF6', value: '' },
  { id: '3', title: 'Phone Number', subtitle: 'Send to mobile number', icon: '📞', color: '#F59E0B', value: '' },
];


export const SendMoneyHomeScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
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

  const filters = ['all', 'upi', 'bank transfer', 'wallet'];
  const tabs = [{ id: 'frequentContacts', label: 'Frequent Contacts' }, { id: 'sendOptions', label: 'Send Via' }];

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
            💸 Send Money
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
            placeholder="Search send money..."
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

        
        {/* Frequent Contacts Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>👥 Frequent Contacts</Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>People you send money to often</Text>
            </View>
            <TouchableOpacity onPress={() => haptics.light()}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {frequentContactsItems.map((item, idx) => (
              <GlassCard
                key={item.id}
                onPress={() => { haptics.medium(); navigation.navigate('ContactsList'); }}
                style={{ width: 180, marginRight: 12, padding: 14 }}
              >
                <Text style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text }} numberOfLines={1}>{item.title}</Text>
                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }} numberOfLines={2}>{item.subtitle}</Text>
                {item.value ? <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.primary, marginTop: 8 }}>{item.value}</Text> : null}
              </GlassCard>
            ))}
          </ScrollView>
          
        </Animated.View>
        

        {/* Send Via Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>📲 Send Via</Text>
              <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>Choose how to send money</Text>
            </View>
            <TouchableOpacity onPress={() => haptics.light()}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={{ paddingHorizontal: 16 }}>
            {sendOptionsItems.map((item, idx) => (
              <Animated.View key={item.id} entering={FadeInRight.duration(400).delay(idx * 60)}>
                <GlassCard
                  onPress={() => { haptics.medium(); navigation.navigate('EnterAmount'); }}
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
        
        <Animated.View entering={FadeInDown.duration(600).delay(400)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>🔥 All Send Money</Text>
          </View>
          {loading ? (
            <SkeletonList count={5} />
          ) : (
            <View style={{ paddingHorizontal: 16 }}>
              {recentTransfersData.map((item, index) => (
                <Animated.View key={item.id} entering={FadeInDown.duration(400).delay(index * 50)}>
                  <GlassCard
                    onPress={() => {
                      haptics.medium();
                      addToHistory(item.title);
                      navigation.navigate('ContactsList', { itemId: item.id, item });
                    }}
                    style={{ marginBottom: 12, padding: 16 }}
                  >
                    <View style={styles.spaceBetween}>
                      <View style={[styles.row, { flex: 1 }]}>
                        <View style={{ width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                          <LinearGradient
                            colors={item.gradient}
                            style={{ width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Text style={{ fontSize: 24 }}>{item.imageEmoji}</Text>
                          </LinearGradient>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={styles.spaceBetween}>
                            <Text style={[styles.cardTitle, { color: theme.colors.text, flex: 1 }]} numberOfLines={1}>{item.title}</Text>
                            <TouchableOpacity
                              onPress={() => {
                                if (isFavorite(item.id)) { removeFavorite(item.id); haptics.warning(); }
                                else { addFavorite(item.id); haptics.success(); }
                              }}
                            >
                              <Ionicons name={isFavorite(item.id) ? 'heart' : 'heart-outline'} size={20} color={isFavorite(item.id) ? theme.colors.error : theme.colors.textTertiary} />
                            </TouchableOpacity>
                          </View>
                          <Text style={[styles.cardSubtitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>{item.subtitle}</Text>
                          <View style={[styles.row, { marginTop: 6 }]}>
                            {item.features.slice(0, 3).map((feat, fIdx) => (
                              <View key={fIdx} style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: theme.colors.primary + '10', marginRight: 6 }}>
                                <Text style={{ fontSize: 10, color: theme.colors.primary, fontWeight: '500' }}>{feat}</Text>
                              </View>
                            ))}
                          </View>
                          <View style={[styles.spaceBetween, { marginTop: 8 }]}>
                            <View style={styles.row}>
                              <Ionicons name="star" size={14} color="#F59E0B" />
                              <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.text, marginLeft: 4 }}>{item.rating}</Text>
                              <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginLeft: 4 }}>({item.reviews})</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                              <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textDecorationLine: 'line-through' }}>₹{item.originalPrice.toLocaleString()}</Text>
                              <Text style={{ fontSize: 18, fontWeight: '800', color: theme.colors.primary }}>₹{item.price.toLocaleString()}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* Bottom Tags */}
                    <View style={[styles.row, { marginTop: 10, flexWrap: 'wrap' }]}>
                      <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: theme.colors.success + '15', marginRight: 6 }}>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: theme.colors.success }}>{item.discount}% OFF</Text>
                      </View>
                      <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: theme.colors.info + '15', marginRight: 6 }}>
                        <Text style={{ fontSize: 10, fontWeight: '500', color: theme.colors.info }}>{item.location}</Text>
                      </View>
                      <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: theme.colors.warning + '15' }}>
                        <Text style={{ fontSize: 10, fontWeight: '500', color: theme.colors.warning }}>{item.status}</Text>
                      </View>
                    </View>
                  </GlassCard>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
        

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
