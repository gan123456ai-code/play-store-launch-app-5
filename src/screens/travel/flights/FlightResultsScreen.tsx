
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
import { useLoadingState } from '../../hooks/useLoadingState';
import {
  GradientBackground, GlassCard, NeumorphicCard,
  SkeletonLoader, SkeletonCard, SkeletonList,
  AnimatedButton, PremiumHeader, SearchBar,
  FloatingAIButton, EmptyState,
} from '../../components/shared';
import { gradientPresets } from '../../constants/theme';
import { getFlightsForRoute, airlines } from '../../../data/flights';
import { Flight } from '../../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const sortOptions = [
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'duration', label: 'Duration: Shortest' },
  { id: 'depart', label: 'Departure: Earliest' },
  { id: 'rating', label: 'Rating: Highest' },
];

const stopFilters = [
  { id: 'all', label: 'All' },
  { id: 'non-stop', label: 'Non-stop' },
  { id: '1-stop', label: '1 Stop' },
  { id: '2-stop', label: '2+ Stops' },
];

export const FlightResultsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const { searchParams } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [selectedSort, setSelectedSort] = useState('price_low');
  const [selectedStop, setSelectedStop] = useState('all');
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = () => {
    setLoading(true);
    setTimeout(() => {
      const fromCode = searchParams?.from?.code || 'DEL';
      const toCode = searchParams?.to?.code || 'BOM';
      const results = getFlightsForRoute(fromCode, toCode);
      setFlights(results);
      setFilteredFlights(results);
      setLoading(false);
    }, 1500);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...flights];
    if (selectedStop === 'non-stop') filtered = filtered.filter(f => f.stops === 0);
    else if (selectedStop === '1-stop') filtered = filtered.filter(f => f.stops === 1);
    else if (selectedStop === '2-stop') filtered = filtered.filter(f => f.stops >= 2);

    if (selectedSort === 'price_low') filtered.sort((a, b) => a.price.total - b.price.total);
    else if (selectedSort === 'price_high') filtered.sort((a, b) => b.price.total - a.price.total);
    else if (selectedSort === 'duration') filtered.sort((a, b) => a.duration.localeCompare(b.duration));
    else if (selectedSort === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    setFilteredFlights(filtered);
  }, [flights, selectedSort, selectedStop]);

  const renderFlightCard = ({ item, index }: { item: Flight; index: number }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 60)} key={item.id}>
      <GlassCard
        onPress={() => {
          haptics.medium();
          navigation.navigate('FlightDetails', { flight: item });
        }}
        style={{ marginHorizontal: 16, marginBottom: 12, padding: 16 }}
      >
        {/* Airline Row */}
        <View style={[styles.spaceBetween, { marginBottom: 12 }]}>
          <View style={styles.row}>
            <Text style={{ fontSize: 24, marginRight: 8 }}>{item.airline.logo}</Text>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text }}>{item.airline.name}</Text>
              <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>{item.flightNumber} • {item.aircraft}</Text>
            </View>
          </View>
          {item.refundable && (
            <View style={[styles.badge, { backgroundColor: theme.colors.success + '20' }]}>
              <Text style={[styles.badgeText, { color: theme.colors.success }]}>Refundable</Text>
            </View>
          )}
        </View>

        {/* Time & Route */}
        <View style={[styles.spaceBetween, { marginBottom: 8 }]}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.text }}>{item.departTime}</Text>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>{item.from.code}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>{item.duration}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginVertical: 4 }}>
              <View style={{ height: 1, flex: 1, backgroundColor: theme.colors.border }} />
              {item.stops > 0 ? (
                <View style={{ paddingHorizontal: 6 }}>
                  <Text style={{ fontSize: 10, color: theme.colors.warning, fontWeight: '600' }}>
                    {item.stops} stop{item.stops > 1 ? 's' : ''}
                  </Text>
                </View>
              ) : (
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.success, marginHorizontal: 4 }} />
              )}
              <View style={{ height: 1, flex: 1, backgroundColor: theme.colors.border }} />
            </View>
            {item.stops > 0 && (
              <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{item.stopCities.join(', ')}</Text>
            )}
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.text }}>{item.arriveTime}</Text>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>{item.to.code}</Text>
          </View>
        </View>

        {/* Amenities Tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
          {item.amenities.slice(0, 4).map((amenity, aIdx) => (
            <View key={aIdx} style={[styles.tag, { backgroundColor: theme.colors.primary + '10' }]}>
              <Text style={[styles.tagText, { color: theme.colors.primary }]}>{amenity}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Price & Book */}
        <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
        <View style={styles.spaceBetween}>
          <View>
            {item.price.originalPrice && (
              <Text style={[styles.cardOldPrice, { color: theme.colors.textTertiary }]}>₹{item.price.originalPrice.toLocaleString()}</Text>
            )}
            <View style={styles.row}>
              <Text style={[styles.cardPrice, { color: theme.colors.text }]}>₹{item.price.total.toLocaleString()}</Text>
              {item.price.discount && (
                <View style={[styles.badge, { backgroundColor: theme.colors.error + '20', marginLeft: 8 }]}>
                  <Text style={[styles.badgeText, { color: theme.colors.error }]}>Save ₹{item.price.discount.toLocaleString()}</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>per person</Text>
          </View>
          <AnimatedButton
            title="View Details"
            onPress={() => { haptics.medium(); navigation.navigate('FlightDetails', { flight: item }); }}
            variant="gradient"
            size="small"
            gradientColors={gradientPresets.primary}
          />
        </View>

        {/* Baggage & Seats */}
        <View style={[styles.row, { marginTop: 10 }]}>
          <Ionicons name="briefcase-outline" size={14} color={theme.colors.textTertiary} />
          <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginLeft: 4 }}>{item.baggage.cabin} cabin + {item.baggage.checkedIn} check-in</Text>
          <View style={{ width: 1, height: 12, backgroundColor: theme.colors.divider, marginHorizontal: 8 }} />
          <Ionicons name="people-outline" size={14} color={theme.colors.textTertiary} />
          <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginLeft: 4 }}>{item.seatAvailable} seats left</Text>
        </View>
      </GlassCard>
    </Animated.View>
  );

  return (
    <GradientBackground>
      <PremiumHeader
        title="Flight Results"
        subtitle={searchParams ? searchParams.from?.code + ' → ' + searchParams.to?.code : 'DEL → BOM'}
        onBack={() => navigation.goBack()}
        gradientColors={gradientPresets.flightCard}
      />

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        {stopFilters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => { haptics.selection(); setSelectedStop(filter.id); }}
            style={[styles.filterChip, {
              backgroundColor: selectedStop === filter.id ? theme.colors.primary : 'transparent',
              borderColor: selectedStop === filter.id ? theme.colors.primary : theme.colors.border,
            }]}
          >
            <Text style={[styles.filterChipText, { color: selectedStop === filter.id ? '#FFFFFF' : theme.colors.textSecondary }]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => { haptics.light(); setShowSortSheet(true); }}
          style={[styles.filterChip, { borderColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center' }]}
        >
          <Ionicons name="funnel-outline" size={14} color={theme.colors.primary} style={{ marginRight: 4 }} />
          <Text style={[styles.filterChipText, { color: theme.colors.primary }]}>Sort & Filter</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results Count */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
          {loading ? 'Searching...' : filteredFlights.length + ' flights found'}
        </Text>
      </View>

      {loading ? (
        <SkeletonList count={5} />
      ) : (
        <FlatList
          data={filteredFlights}
          renderItem={renderFlightCard}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon="✈️"
              title="No Flights Found"
              description="Try adjusting your search filters or dates"
              actionLabel="Modify Search"
              onAction={() => navigation.goBack()}
            />
          }
        />
      )}

      {/* Sort Bottom Sheet */}
      {showSortSheet && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: isDark ? theme.colors.surface : theme.colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 40, borderTopWidth: 1, borderColor: theme.colors.border }}>
          <View style={[styles.spaceBetween, { marginBottom: 16 }]}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text }}>Sort By</Text>
            <TouchableOpacity onPress={() => setShowSortSheet(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => { haptics.selection(); setSelectedSort(option.id); setShowSortSheet(false); }}
              style={[styles.sortOption, { borderBottomWidth: 1, borderColor: theme.colors.divider }]}
            >
              <View style={[styles.radioOuter, { borderColor: selectedSort === option.id ? theme.colors.primary : theme.colors.border }]}>
                {selectedSort === option.id && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
              </View>
              <Text style={{ fontSize: 16, color: theme.colors.text }}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <FloatingAIButton />
    </GradientBackground>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  sectionSubtitle: { fontSize: 13, marginTop: 2 },
  seeAll: { fontSize: 14, fontWeight: '600' },
  card: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardContent: { flex: 1, marginLeft: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, marginTop: 2 },
  cardPrice: { fontSize: 18, fontWeight: '700' },
  cardOldPrice: { fontSize: 13, textDecorationLine: 'line-through', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  row: { flexDirection: 'row', alignItems: 'center' },
  spaceBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '500' },
  chipRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  divider: { height: 1, marginVertical: 12 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  bigIcon: { fontSize: 32 },
  smallIcon: { fontSize: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 14, fontWeight: '600', marginLeft: 4 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 6, marginBottom: 6 },
  tagText: { fontSize: 11, fontWeight: '500' },
  tabBar: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  tabText: { fontSize: 14, fontWeight: '600' },
  headerCard: { marginHorizontal: 16, marginTop: -20, borderRadius: 20, padding: 20, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  floatingButton: { position: 'absolute', bottom: 90, right: 16, zIndex: 100 },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
  listItemIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  listItemContent: { flex: 1 },
  listItemTitle: { fontSize: 16, fontWeight: '500' },
  listItemSubtitle: { fontSize: 13, marginTop: 2 },
  listItemRight: { alignItems: 'flex-end' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomButton: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16 },
  formGroup: { marginBottom: 16 },
  counter: { flexDirection: 'row', alignItems: 'center' },
  counterBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  counterValue: { fontSize: 18, fontWeight: '600', marginHorizontal: 16 },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  gridItem: { width: '50%', padding: 4 },
  gridItemInner: { borderRadius: 16, padding: 16, alignItems: 'center' },
  separator: { height: 8 },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 8 },
  seat: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', margin: 3, borderWidth: 1 },
  seatText: { fontSize: 10, fontWeight: '600' },
  timeline: { paddingLeft: 32 },
  timelineItem: { flexDirection: 'row', marginBottom: 20 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, position: 'absolute', left: -26, top: 4 },
  timelineLine: { position: 'absolute', left: -21, top: 16, width: 2, height: '100%' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { borderRadius: 20, padding: 24 },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  stepDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  stepLine: { width: 24, height: 2, marginHorizontal: 2, marginTop: 3 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  imageGallery: { height: 200 },
  galleryImage: { width: SCREEN_WIDTH - 32, height: 200, borderRadius: 16, marginRight: 8 },
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityItem: { width: '33%', alignItems: 'center', paddingVertical: 12 },
  amenityIcon: { fontSize: 24, marginBottom: 4 },
  amenityLabel: { fontSize: 11, textAlign: 'center' },
  reviewCard: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  reviewName: { fontSize: 15, fontWeight: '600' },
  reviewDate: { fontSize: 12 },
  reviewText: { fontSize: 14, lineHeight: 20 },
  starRow: { flexDirection: 'row', marginVertical: 4 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontWeight: '500' },
  sortOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  priceBreakdown: { borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, marginTop: 8 },
  totalLabel: { fontSize: 18, fontWeight: '700' },
  totalAmount: { fontSize: 22, fontWeight: '800' },
});
