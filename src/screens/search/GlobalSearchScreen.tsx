
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  TextInput, FlatList, Dimensions, ActivityIndicator,
} from 'react-native';
import Animated, {
  FadeInDown, FadeInUp, FadeInRight, ZoomIn, Layout,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import {
  GradientBackground, GlassCard, AnimatedButton,
  FloatingAIButton,
} from '../../components/shared';
import { gradientPresets } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'flight' | 'hotel' | 'train' | 'transaction' | 'contact' | 'bill' | 'investment' | 'setting';
  icon: string;
  gradient: string[];
  screen: string;
}

const allResults: SearchResult[] = [
  { id: '1', title: 'Delhi to Mumbai Flights', subtitle: 'From ₹2,499 • 24 flights available', type: 'flight', icon: '✈️', gradient: ['#6366F1', '#8B5CF6'], screen: 'FlightResults' },
  { id: '2', title: 'Goa Beach Resorts', subtitle: 'From ₹3,500/night • 4.5★ avg', type: 'hotel', icon: '🏨', gradient: ['#EC4899', '#F472B6'], screen: 'HotelResults' },
  { id: '3', title: 'Rajdhani Express', subtitle: 'DEL-MUM • 16h 25m • ₹1,850', type: 'train', icon: '🚂', gradient: ['#F59E0B', '#FBBF24'], screen: 'TrainResults' },
  { id: '4', title: 'Rahul Kumar - ₹5,000', subtitle: 'Received via UPI • Today', type: 'transaction', icon: '💰', gradient: ['#10B981', '#34D399'], screen: 'TransactionDetails' },
  { id: '5', title: 'Priya Sharma', subtitle: 'UPI: priya@hdfc • ₹15,000 sent', type: 'contact', icon: '👤', gradient: ['#8B5CF6', '#A78BFA'], screen: 'ContactsList' },
  { id: '6', title: 'Electricity Bill', subtitle: '₹2,450 due tomorrow • Tata Power', type: 'bill', icon: '⚡', gradient: ['#EF4444', '#F87171'], screen: 'BillDetails' },
  { id: '7', title: 'Axis Bluechip Fund', subtitle: '+15.2% returns • ₹50,000 invested', type: 'investment', icon: '📈', gradient: ['#06B6D4', '#22D3EE'], screen: 'MutualFundDetails' },
  { id: '8', title: 'Dark Mode', subtitle: 'Appearance Settings', type: 'setting', icon: '🌙', gradient: ['#64748B', '#94A3B8'], screen: 'AppearanceSettings' },
  { id: '9', title: 'Mumbai to Goa Flights', subtitle: 'From ₹1,999 • 18 flights', type: 'flight', icon: '✈️', gradient: ['#6366F1', '#8B5CF6'], screen: 'FlightResults' },
  { id: '10', title: 'Taj Palace New Delhi', subtitle: '₹12,500/night • 4.8★', type: 'hotel', icon: '🏨', gradient: ['#EC4899', '#F472B6'], screen: 'HotelDetails' },
  { id: '11', title: 'Shatabdi Express', subtitle: 'DEL-AGR • 2h • ₹890', type: 'train', icon: '🚂', gradient: ['#F59E0B', '#FBBF24'], screen: 'TrainResults' },
  { id: '12', title: 'Amazon Purchase', subtitle: '₹1,250 • HDFC Credit Card', type: 'transaction', icon: '🛒', gradient: ['#10B981', '#34D399'], screen: 'TransactionDetails' },
  { id: '13', title: 'Mobile Recharge', subtitle: 'Jio ₹599 • Due in 5 days', type: 'bill', icon: '📱', gradient: ['#EF4444', '#F87171'], screen: 'RechargePlans' },
  { id: '14', title: 'SBI FD', subtitle: '7.1% p.a. • ₹2,00,000', type: 'investment', icon: '🏦', gradient: ['#06B6D4', '#22D3EE'], screen: 'FDDetails' },
  { id: '15', title: 'Notification Settings', subtitle: 'Push, Email, SMS preferences', type: 'setting', icon: '🔔', gradient: ['#64748B', '#94A3B8'], screen: 'NotificationSettings' },
  { id: '16', title: 'Bangalore to Chennai', subtitle: 'From ₹1,299 • 12 flights', type: 'flight', icon: '✈️', gradient: ['#6366F1', '#8B5CF6'], screen: 'FlightResults' },
  { id: '17', title: 'ITC Grand Chola', subtitle: '₹9,800/night • 4.7★', type: 'hotel', icon: '🏨', gradient: ['#EC4899', '#F472B6'], screen: 'HotelDetails' },
  { id: '18', title: 'Digital Gold', subtitle: '₹5,500/gram • +8% this year', type: 'investment', icon: '🪙', gradient: ['#F59E0B', '#FBBF24'], screen: 'GoldInvestment' },
  { id: '19', title: 'HDFC Savings Account', subtitle: 'Balance: ₹18,55,440', type: 'transaction', icon: '🏦', gradient: ['#10B981', '#34D399'], screen: 'AccountsOverview' },
  { id: '20', title: 'Broadband Bill', subtitle: 'Airtel ₹999 • Due next week', type: 'bill', icon: '🌐', gradient: ['#EF4444', '#F87171'], screen: 'BillDetails' },
];

const recentSearches = [
  'Delhi to Mumbai flights', 'Goa hotels', 'Electricity bill', 'Send money to Rahul',
  'Train to Jaipur', 'Mutual fund returns', 'Credit card statement', 'Mobile recharge',
];

const trendingSearches = [
  { query: 'New Year flights to Goa', icon: '🔥' },
  { query: 'Budget hotels in Manali', icon: '❄️' },
  { query: 'Tax saving investments', icon: '📊' },
  { query: 'Rajdhani Express booking', icon: '🚂' },
  { query: 'Credit card offers', icon: '💳' },
  { query: 'International flights sale', icon: '✈️' },
];

const categories = [
  { id: 'all', label: 'All', icon: '🔍' },
  { id: 'flight', label: 'Flights', icon: '✈️' },
  { id: 'hotel', label: 'Hotels', icon: '🏨' },
  { id: 'train', label: 'Trains', icon: '🚂' },
  { id: 'transaction', label: 'Transactions', icon: '💰' },
  { id: 'bill', label: 'Bills', icon: '📋' },
  { id: 'investment', label: 'Investments', icon: '📈' },
  { id: 'contact', label: 'Contacts', icon: '👤' },
  { id: 'setting', label: 'Settings', icon: '⚙️' },
];

export const GlobalSearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { addToHistory } = useApp();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (query.trim().length > 0) {
      setSearching(true);
      const timer = setTimeout(() => {
        const filtered = allResults.filter(r => {
          const matchesQuery = r.title.toLowerCase().includes(query.toLowerCase()) || r.subtitle.toLowerCase().includes(query.toLowerCase());
          const matchesCategory = selectedCategory === 'all' || r.type === selectedCategory;
          return matchesQuery && matchesCategory;
        });
        setResults(filtered);
        setSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query, selectedCategory]);

  const handleResultPress = useCallback((result: SearchResult) => {
    haptics.medium();
    addToHistory(result.title);
    navigation.navigate(result.screen);
  }, [haptics, navigation, addToHistory]);

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Search Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.searchHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={[styles.searchInput, { backgroundColor: isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
            <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={query}
              onChangeText={setQuery}
              placeholder="Search flights, hotels, transactions..."
              placeholderTextColor={theme.colors.textTertiary}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Category Chips */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => { haptics.selection(); setSelectedCategory(cat.id); }}
                style={[styles.categoryChip, {
                  backgroundColor: selectedCategory === cat.id ? theme.colors.primary : 'transparent',
                  borderColor: selectedCategory === cat.id ? theme.colors.primary : theme.colors.border,
                }]}
              >
                <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
                <Text style={[styles.categoryLabel, { color: selectedCategory === cat.id ? '#FFFFFF' : theme.colors.textSecondary }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {query.trim().length === 0 ? (
            <>
              {/* Recent Searches */}
              <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🕐 Recent Searches</Text>
                  <TouchableOpacity><Text style={{ color: theme.colors.primary, fontSize: 14 }}>Clear All</Text></TouchableOpacity>
                </View>
                <View style={styles.tagsWrap}>
                  {recentSearches.map((search, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => { haptics.light(); setQuery(search); }}
                      style={[styles.recentTag, { backgroundColor: isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}
                    >
                      <Ionicons name="time-outline" size={14} color={theme.colors.textTertiary} />
                      <Text style={[styles.recentText, { color: theme.colors.textSecondary }]}>{search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>

              {/* Trending */}
              <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                <View style={styles.sectionHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🔥 Trending Now</Text>
                </View>
                {trendingSearches.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => { haptics.light(); setQuery(item.query); }}
                    style={[styles.trendingItem, { borderBottomColor: theme.colors.divider }]}
                  >
                    <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
                    <Text style={[styles.trendingText, { color: theme.colors.text }]}>{item.query}</Text>
                    <Ionicons name="trending-up" size={16} color={theme.colors.success} />
                  </TouchableOpacity>
                ))}
              </Animated.View>

              {/* Quick Actions */}
              <Animated.View entering={FadeInDown.duration(400).delay(300)} style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 24 }}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 12 }]}>⚡ Quick Access</Text>
                <View style={styles.quickGrid}>
                  {[
                    { icon: '✈️', label: 'Flights', color: '#6366F1' },
                    { icon: '🏨', label: 'Hotels', color: '#EC4899' },
                    { icon: '🚂', label: 'Trains', color: '#F59E0B' },
                    { icon: '💸', label: 'Send', color: '#10B981' },
                    { icon: '📊', label: 'Balance', color: '#8B5CF6' },
                    { icon: '📱', label: 'Recharge', color: '#06B6D4' },
                    { icon: '📈', label: 'Invest', color: '#D97706' },
                    { icon: '🧾', label: 'Bills', color: '#EF4444' },
                  ].map((item, idx) => (
                    <TouchableOpacity key={idx} style={[styles.quickItem, { backgroundColor: item.color + '10' }]} onPress={() => haptics.medium()}>
                      <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                      <Text style={[styles.quickLabel, { color: theme.colors.text }]}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Animated.View>
            </>
          ) : searching ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Searching...</Text>
            </View>
          ) : results.length > 0 ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
              <Text style={[styles.resultCount, { color: theme.colors.textSecondary }]}>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </Text>
              {results.map((result, idx) => (
                <Animated.View key={result.id} entering={FadeInDown.duration(300).delay(idx * 40)}>
                  <GlassCard onPress={() => handleResultPress(result)} style={{ marginBottom: 10, padding: 14 }}>
                    <View style={styles.resultRow}>
                      <LinearGradient colors={result.gradient} style={styles.resultIcon}>
                        <Text style={{ fontSize: 20 }}>{result.icon}</Text>
                      </LinearGradient>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.resultTitle, { color: theme.colors.text }]}>{result.title}</Text>
                        <Text style={[styles.resultSubtitle, { color: theme.colors.textSecondary }]}>{result.subtitle}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 4 }}>
                          <View style={[styles.typeTag, { backgroundColor: result.gradient[0] + '15' }]}>
                            <Text style={{ fontSize: 10, color: result.gradient[0], fontWeight: '500' }}>
                              {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                            </Text>
                          </View>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                    </View>
                  </GlassCard>
                </Animated.View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize: 48 }}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No results found</Text>
              <Text style={[styles.emptyDesc, { color: theme.colors.textSecondary }]}>
                Try a different search term or browse categories
              </Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      <FloatingAIButton />
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  backBtn: { marginRight: 12, padding: 4 },
  searchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1 },
  input: { flex: 1, fontSize: 16, marginLeft: 10, marginRight: 8 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  categoryLabel: { fontSize: 13, fontWeight: '500', marginLeft: 6 },
  content: { flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  recentTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginRight: 8, marginBottom: 8, borderWidth: 1 },
  recentText: { fontSize: 13, marginLeft: 6 },
  trendingItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  trendingText: { flex: 1, fontSize: 15 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  quickItem: { width: (SCREEN_WIDTH - 48) / 4, margin: 4, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  quickLabel: { fontSize: 11, fontWeight: '600', marginTop: 6 },
  loadingWrap: { alignItems: 'center', paddingTop: 60 },
  loadingText: { fontSize: 15, marginTop: 12 },
  resultCount: { fontSize: 13, marginBottom: 12 },
  resultRow: { flexDirection: 'row', alignItems: 'center' },
  resultIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontSize: 15, fontWeight: '600' },
  resultSubtitle: { fontSize: 12, marginTop: 2 },
  typeTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  emptyWrap: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 12 },
  emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
