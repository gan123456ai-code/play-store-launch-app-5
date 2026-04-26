
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
import { airports, airlines, popularRoutes } from '../../../data/flights';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const tripTypes = [
  { id: 'one-way', label: 'One Way', icon: '→' },
  { id: 'round-trip', label: 'Round Trip', icon: '⇄' },
  { id: 'multi-city', label: 'Multi City', icon: '⤳' },
];

const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First'];

const recentSearches = [
  { from: 'DEL', to: 'BOM', date: '25 Dec', price: '₹4,299' },
  { from: 'BLR', to: 'GOI', date: '31 Dec', price: '₹3,199' },
  { from: 'DEL', to: 'DXB', date: '15 Jan', price: '₹12,499' },
];

const trendingDeals = [
  { from: 'Delhi', to: 'Goa', price: 2999, discount: 40, airline: 'IndiGo', emoji: '🏖️', gradient: ['#F97316', '#EC4899'] },
  { from: 'Mumbai', to: 'Bangkok', price: 8999, discount: 35, airline: 'Air India', emoji: '🏯', gradient: ['#8B5CF6', '#6366F1'] },
  { from: 'Bengaluru', to: 'Singapore', price: 11999, discount: 30, airline: 'Singapore Airlines', emoji: '🦁', gradient: ['#06B6D4', '#3B82F6'] },
  { from: 'Delhi', to: 'London', price: 32999, discount: 25, airline: 'British Airways', emoji: '🇬🇧', gradient: ['#DC2626', '#7C3AED'] },
  { from: 'Mumbai', to: 'Dubai', price: 9999, discount: 28, airline: 'Emirates', emoji: '🏙️', gradient: ['#D97706', '#F59E0B'] },
  { from: 'Chennai', to: 'Kuala Lumpur', price: 7499, discount: 32, airline: 'Air India Express', emoji: '🌴', gradient: ['#059669', '#10B981'] },
];

const airlineOffers = [
  { airline: 'IndiGo', offer: 'Flat 15% off on all domestic flights', code: 'INDI15', validTill: '31 Dec 2024', gradient: ['#2B3990', '#4F46E5'] },
  { airline: 'Air India', offer: 'Extra 10kg baggage free on international routes', code: 'AIBAG10', validTill: '15 Jan 2025', gradient: ['#E85D2C', '#F97316'] },
  { airline: 'Vistara', offer: 'Upgrade to business class at 50% off', code: 'VSTBIZ', validTill: '31 Jan 2025', gradient: ['#6B2F8A', '#8B5CF6'] },
  { airline: 'Emirates', offer: 'Free Dubai stopover package for 2 nights', code: 'EKDXB', validTill: '28 Feb 2025', gradient: ['#D71921', '#EF4444'] },
];

export const FlightSearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { addToHistory } = useApp();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const [tripType, setTripType] = useState('one-way');
  const [fromAirport, setFromAirport] = useState(airports[0]);
  const [toAirport, setToAirport] = useState(airports[1]);
  const [departDate, setDepartDate] = useState('25 Dec 2024');
  const [returnDate, setReturnDate] = useState('30 Dec 2024');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState('Economy');
  const [showCabinPicker, setShowCabinPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const headerScale = useSharedValue(1);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleSwapAirports = () => {
    haptics.medium();
    const temp = fromAirport;
    setFromAirport(toAirport);
    setToAirport(temp);
  };

  const handleSearch = () => {
    haptics.heavy();
    addToHistory(fromAirport.code + ' → ' + toAirport.code);
    navigation.navigate('FlightResults', {
      searchParams: {
        tripType, from: fromAirport, to: toAirport,
        departDate, returnDate: tripType === 'round-trip' ? returnDate : undefined,
        passengers: { adults, children, infants },
        cabinClass: cabinClass.toLowerCase().replace(' ', '-'),
      },
    });
  };

  return (
    <GradientBackground>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 28, fontWeight: '800' }]}>
              ✈️ Flights
            </Text>
            <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary, fontSize: 15 }]}>
              Find the best deals on domestic & international flights
            </Text>
          </Animated.View>
        </View>

        {/* Trip Type Selector */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <View style={[styles.row, { backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary, borderRadius: 14, padding: 4 }]}>
            {tripTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => { haptics.selection(); setTripType(type.id); }}
                style={{ flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: tripType === type.id ? theme.colors.primary : 'transparent' }}
              >
                <Text style={{ color: tripType === type.id ? '#FFFFFF' : theme.colors.textSecondary, fontWeight: '600', fontSize: 13 }}>
                  {type.icon} {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Search Form Card */}
        <Animated.View entering={FadeInDown.duration(600).delay(200)}>
          <GlassCard style={{ marginHorizontal: 16, marginBottom: 20, padding: 20 }} animated={false}>
            {/* From Airport */}
            <TouchableOpacity
              onPress={() => { haptics.light(); }}
              style={[styles.input, { borderColor: theme.colors.border, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary, flexDirection: 'row', alignItems: 'center' }]}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.primary + '15', width: 36, height: 36, borderRadius: 18 }]}>
                <Ionicons name="airplane-outline" size={18} color={theme.colors.primary} style={{ transform: [{ rotate: '-45deg' }] }} />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.label, { color: theme.colors.textTertiary, fontSize: 12, marginBottom: 0 }]}>From</Text>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{fromAirport.city} ({fromAirport.code})</Text>
                <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>{fromAirport.name}</Text>
              </View>
            </TouchableOpacity>

            {/* Swap Button */}
            <View style={{ alignItems: 'center', marginVertical: -8, zIndex: 10 }}>
              <TouchableOpacity
                onPress={handleSwapAirports}
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }}
              >
                <Ionicons name="swap-vertical" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* To Airport */}
            <TouchableOpacity
              onPress={() => { haptics.light(); }}
              style={[styles.input, { borderColor: theme.colors.border, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary, flexDirection: 'row', alignItems: 'center' }]}
            >
              <View style={[styles.iconCircle, { backgroundColor: theme.colors.secondary + '15', width: 36, height: 36, borderRadius: 18 }]}>
                <Ionicons name="location" size={18} color={theme.colors.secondary} />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={[styles.label, { color: theme.colors.textTertiary, fontSize: 12, marginBottom: 0 }]}>To</Text>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{toAirport.city} ({toAirport.code})</Text>
                <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>{toAirport.name}</Text>
              </View>
            </TouchableOpacity>

            {/* Date Row */}
            <View style={[styles.row, { marginBottom: 12 }]}>
              <TouchableOpacity style={[styles.input, { flex: 1, marginRight: 8, flexDirection: 'row', alignItems: 'center', borderColor: theme.colors.border, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}>
                <Ionicons name="calendar-outline" size={18} color={theme.colors.primary} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Departure</Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text }}>{departDate}</Text>
                </View>
              </TouchableOpacity>
              {tripType === 'round-trip' && (
                <TouchableOpacity style={[styles.input, { flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: theme.colors.border, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}>
                  <Ionicons name="calendar-outline" size={18} color={theme.colors.secondary} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Return</Text>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text }}>{returnDate}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Passengers & Class */}
            <View style={[styles.row, { marginBottom: 16 }]}>
              <TouchableOpacity style={[styles.input, { flex: 1, marginRight: 8, flexDirection: 'row', alignItems: 'center', borderColor: theme.colors.border, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}>
                <Ionicons name="people-outline" size={18} color={theme.colors.accent} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Passengers</Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text }}>{adults + children + infants} Pax</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { haptics.light(); setShowCabinPicker(!showCabinPicker); }}
                style={[styles.input, { flex: 1, flexDirection: 'row', alignItems: 'center', borderColor: theme.colors.border, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
              >
                <Ionicons name="briefcase-outline" size={18} color={theme.colors.warning} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Class</Text>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text }}>{cabinClass}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {showCabinPicker && (
              <Animated.View entering={FadeInDown.duration(300)} style={{ marginBottom: 12 }}>
                {cabinClasses.map((cls) => (
                  <TouchableOpacity
                    key={cls}
                    onPress={() => { haptics.selection(); setCabinClass(cls); setShowCabinPicker(false); }}
                    style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 4, backgroundColor: cabinClass === cls ? theme.colors.primary + '15' : 'transparent' }}
                  >
                    <Text style={{ color: cabinClass === cls ? theme.colors.primary : theme.colors.text, fontWeight: cabinClass === cls ? '600' : '400' }}>{cls}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}

            {/* Passenger Counters */}
            <View style={{ marginBottom: 16 }}>
              {[
                { label: 'Adults', sublabel: '12+ years', value: adults, setValue: setAdults, min: 1, max: 9 },
                { label: 'Children', sublabel: '2-12 years', value: children, setValue: setChildren, min: 0, max: 6 },
                { label: 'Infants', sublabel: '0-2 years', value: infants, setValue: setInfants, min: 0, max: 2 },
              ].map((item) => (
                <View key={item.label} style={[styles.spaceBetween, { marginBottom: 12 }]}>
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.text }}>{item.label}</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>{item.sublabel}</Text>
                  </View>
                  <View style={styles.counter}>
                    <TouchableOpacity
                      onPress={() => { if (item.value > item.min) { haptics.light(); item.setValue(item.value - 1); } }}
                      style={[styles.counterBtn, { borderColor: theme.colors.border, opacity: item.value <= item.min ? 0.3 : 1 }]}
                    >
                      <Ionicons name="remove" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.counterValue, { color: theme.colors.text }]}>{item.value}</Text>
                    <TouchableOpacity
                      onPress={() => { if (item.value < item.max) { haptics.light(); item.setValue(item.value + 1); } }}
                      style={[styles.counterBtn, { borderColor: theme.colors.border, opacity: item.value >= item.max ? 0.3 : 1 }]}
                    >
                      <Ionicons name="add" size={18} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Search Button */}
            <AnimatedButton
              title="Search Flights"
              onPress={handleSearch}
              variant="gradient"
              size="large"
              fullWidth
              gradientColors={gradientPresets.primary}
              icon={<Ionicons name="search" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />}
            />
          </GlassCard>
        </Animated.View>

        {/* Recent Searches */}
        <Animated.View entering={FadeInDown.duration(600).delay(300)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>Recent Searches</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>Quick access to your searches</Text>
            </View>
            <TouchableOpacity onPress={() => haptics.light()}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {recentSearches.map((search, idx) => (
              <GlassCard
                key={idx}
                onPress={() => { haptics.light(); handleSearch(); }}
                style={{ width: 180, marginRight: 12, padding: 14 }}
              >
                <View style={styles.row}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{search.from}</Text>
                  <Ionicons name="arrow-forward" size={14} color={theme.colors.textTertiary} style={{ marginHorizontal: 6 }} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>{search.to}</Text>
                </View>
                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 }}>{search.date}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.primary, marginTop: 6 }}>{search.price}</Text>
              </GlassCard>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Trending Deals */}
        <Animated.View entering={FadeInDown.duration(600).delay(400)} style={{ marginTop: 24 }}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>🔥 Trending Deals</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>Lowest prices this week</Text>
            </View>
            <TouchableOpacity onPress={() => haptics.light()}>
              <Text style={[styles.seeAll, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          {trendingDeals.map((deal, idx) => (
            <Animated.View key={idx} entering={FadeInRight.duration(400).delay(idx * 80)}>
              <TouchableOpacity
                onPress={() => { haptics.medium(); handleSearch(); }}
                style={{ marginHorizontal: 16, marginBottom: 12 }}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={deal.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={{ fontSize: 36, marginRight: 14 }}>{deal.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                      {deal.from} → {deal.to}
                    </Text>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{deal.airline}</Text>
                    <View style={[styles.row, { marginTop: 6 }]}>
                      <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF' }}>₹{deal.price.toLocaleString()}</Text>
                      <View style={{ backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginLeft: 8 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>{deal.discount}% OFF</Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.7)" />
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Airline Offers */}
        <Animated.View entering={FadeInDown.duration(600).delay(500)} style={{ marginTop: 8 }}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>✨ Airline Offers</Text>
              <Text style={[styles.sectionSubtitle, { color: theme.colors.textSecondary }]}>Exclusive deals for you</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {airlineOffers.map((offer, idx) => (
              <TouchableOpacity key={idx} onPress={() => haptics.light()} activeOpacity={0.85}>
                <LinearGradient
                  colors={offer.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 260, borderRadius: 16, padding: 16, marginRight: 12 }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>{offer.airline}</Text>
                  <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 6, lineHeight: 18 }}>{offer.offer}</Text>
                  <View style={[styles.spaceBetween, { marginTop: 12 }]}>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>{offer.code}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Valid till {offer.validTill}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Popular Routes */}
        <Animated.View entering={FadeInDown.duration(600).delay(600)} style={{ marginTop: 24 }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>🗺️ Popular Routes</Text>
          </View>
          <View style={styles.gridRow}>
            {popularRoutes.slice(0, 8).map((route, idx) => {
              const fromAp = airports.find(a => a.code === route.from);
              const toAp = airports.find(a => a.code === route.to);
              return (
                <View key={idx} style={styles.gridItem}>
                  <GlassCard
                    onPress={() => { haptics.light(); handleSearch(); }}
                    style={{ padding: 14 }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.text }}>
                      {fromAp?.city?.split(' ')[0]} → {toAp?.city?.split(' ')[0]}
                    </Text>
                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginTop: 2 }}>
                      {route.from} - {route.to}
                    </Text>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.primary, marginTop: 8 }}>
                      From ₹{(2999 + idx * 800).toLocaleString()}
                    </Text>
                  </GlassCard>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Airlines Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(700)} style={{ marginTop: 16 }}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18 }]}>🛫 Top Airlines</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {airlines.slice(0, 8).map((airline, idx) => (
              <GlassCard
                key={idx}
                onPress={() => { haptics.light(); navigation.navigate('AirlineInfo', { airline }); }}
                style={{ width: 120, marginRight: 12, padding: 14, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 32 }}>{airline.logo}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.text, marginTop: 6, textAlign: 'center' }} numberOfLines={1}>
                  {airline.name}
                </Text>
                <View style={[styles.row, { marginTop: 4 }]}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginLeft: 3 }}>{airline.rating}</Text>
                </View>
              </GlassCard>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
