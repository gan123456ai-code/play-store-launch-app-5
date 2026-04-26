
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
import { insuranceOptions, mealOptions } from '../../../data/flights';
import { Flight } from '../../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export const FlightDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const { isFavorite, addFavorite, removeFavorite } = useApp();
  const flight: Flight = route.params?.flight;
  const [selectedTab, setSelectedTab] = useState('details');
  const [loading, setLoading] = useState(true);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (!flight) return <EmptyState icon="✈️" title="Flight not found" description="Please go back and select a flight" />;

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'fare', label: 'Fare Rules' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'baggage', label: 'Baggage' },
  ];

  const toggleFavorite = () => {
    if (isFavorite(flight.id)) {
      removeFavorite(flight.id);
      haptics.warning();
    } else {
      addFavorite(flight.id);
      haptics.success();
    }
  };

  return (
    <GradientBackground>
      <PremiumHeader
        title={flight.from.code + ' → ' + flight.to.code}
        subtitle={flight.airline.name + ' • ' + flight.flightNumber}
        onBack={() => navigation.goBack()}
        rightAction={toggleFavorite}
        rightIcon={isFavorite(flight.id) ? 'heart' : 'heart-outline'}
        gradientColors={gradientPresets.flightCard}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <SkeletonList count={4} />
        ) : (
          <>
            {/* Flight Summary Card */}
            <Animated.View entering={FadeInDown.duration(500)}>
              <GlassCard style={[styles.headerCard, { marginTop: 8 }]} animated={false}>
                <View style={styles.spaceBetween}>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: theme.colors.text }}>{flight.departTime}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.primary }}>{flight.from.code}</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary }} numberOfLines={1}>{flight.from.city}</Text>
                    <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{flight.from.terminal || 'T1'}</Text>
                  </View>
                  <View style={{ alignItems: 'center', flex: 1.2 }}>
                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>{flight.duration}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6 }}>
                      <View style={{ height: 1, width: 40, backgroundColor: theme.colors.border }} />
                      <Text style={{ fontSize: 18, marginHorizontal: 6 }}>✈️</Text>
                      <View style={{ height: 1, width: 40, backgroundColor: theme.colors.border }} />
                    </View>
                    <Text style={{ fontSize: 12, color: flight.stops === 0 ? theme.colors.success : theme.colors.warning, fontWeight: '600' }}>
                      {flight.stops === 0 ? 'Non-stop' : flight.stops + ' Stop' + (flight.stops > 1 ? 's' : '')}
                    </Text>
                    {flight.stops > 0 && (
                      <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{flight.stopCities.join(', ')}</Text>
                    )}
                  </View>
                  <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 32, fontWeight: '800', color: theme.colors.text }}>{flight.arriveTime}</Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.secondary }}>{flight.to.code}</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary }} numberOfLines={1}>{flight.to.city}</Text>
                    <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>{flight.to.terminal || 'T1'}</Text>
                  </View>
                </View>

                {/* Stats */}
                <View style={[styles.statsRow, { marginTop: 16, borderTopWidth: 1, borderColor: theme.colors.divider }]}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.colors.text, fontSize: 16 }]}>{flight.aircraft}</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Aircraft</Text>
                  </View>
                  <View style={styles.statItem}>
                    <View style={styles.row}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={[styles.statValue, { color: theme.colors.text, fontSize: 16, marginLeft: 4 }]}>{flight.rating}</Text>
                    </View>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Rating</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.colors.success, fontSize: 16 }]}>{flight.onTimePerformance}%</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>On Time</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: theme.colors.text, fontSize: 16 }]}>{flight.co2Emission}kg</Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>CO₂</Text>
                  </View>
                </View>
              </GlassCard>
            </Animated.View>

            {/* Tab Selector */}
            <Animated.View entering={FadeInDown.duration(500).delay(100)}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
                {tabs.map((tab) => (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => { haptics.selection(); setSelectedTab(tab.id); }}
                    style={[styles.tab, { backgroundColor: selectedTab === tab.id ? theme.colors.primary : isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary }]}
                  >
                    <Text style={[styles.tabText, { color: selectedTab === tab.id ? '#FFFFFF' : theme.colors.textSecondary }]}>{tab.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>

            {/* Tab Content */}
            {selectedTab === 'details' && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                {/* Layover Info */}
                {flight.layovers && flight.layovers.length > 0 && (
                  <GlassCard style={{ marginBottom: 16, padding: 14 }} animated={false}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>Layover Details</Text>
                    {flight.layovers.map((layover, idx) => (
                      <View key={idx} style={[styles.row, { marginBottom: 6 }]}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.warning + '15', width: 36, height: 36, borderRadius: 18 }]}>
                          <Ionicons name="time-outline" size={16} color={theme.colors.warning} />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.text }}>
                            {layover.airport.city} ({layover.airport.code})
                          </Text>
                          <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                            {layover.duration} layover {layover.changeTerminal ? '• Terminal change' : ''}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </GlassCard>
                )}

                {/* Airline Info */}
                <GlassCard
                  onPress={() => navigation.navigate('AirlineInfo', { airline: flight.airline })}
                  style={{ marginBottom: 16, padding: 14 }}
                >
                  <View style={styles.spaceBetween}>
                    <View style={styles.row}>
                      <Text style={{ fontSize: 28, marginRight: 10 }}>{flight.airline.logo}</Text>
                      <View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>{flight.airline.name}</Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                          {flight.airline.alliance || 'Independent'} • {flight.airline.reviewCount.toLocaleString()} reviews
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>

                {/* Reviews Link */}
                <GlassCard
                  onPress={() => navigation.navigate('FlightReviews', { flightId: flight.id })}
                  style={{ marginBottom: 16, padding: 14 }}
                >
                  <View style={styles.spaceBetween}>
                    <View style={styles.row}>
                      <Ionicons name="chatbubbles-outline" size={22} color={theme.colors.primary} />
                      <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.text, marginLeft: 10 }}>Passenger Reviews</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>

                {/* Baggage Info Link */}
                <GlassCard
                  onPress={() => navigation.navigate('BaggageInfo', { flight })}
                  style={{ marginBottom: 16, padding: 14 }}
                >
                  <View style={styles.spaceBetween}>
                    <View style={styles.row}>
                      <Ionicons name="briefcase-outline" size={22} color={theme.colors.accent} />
                      <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.text, marginLeft: 10 }}>Baggage Information</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>

                {/* Insurance Link */}
                <GlassCard
                  onPress={() => navigation.navigate('InsuranceOptions', { flight })}
                  style={{ marginBottom: 16, padding: 14 }}
                >
                  <View style={styles.spaceBetween}>
                    <View style={styles.row}>
                      <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.success} />
                      <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.text, marginLeft: 10 }}>Travel Insurance</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>

                {/* Meal Link */}
                <GlassCard
                  onPress={() => navigation.navigate('MealSelection', { flight, bookingId: '' })}
                  style={{ marginBottom: 16, padding: 14 }}
                >
                  <View style={styles.spaceBetween}>
                    <View style={styles.row}>
                      <Ionicons name="restaurant-outline" size={22} color={theme.colors.warning} />
                      <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.text, marginLeft: 10 }}>Pre-book Meals</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>

                {/* Lounge Link */}
                <GlassCard
                  onPress={() => navigation.navigate('LoungAccess', { airport: flight.from.code })}
                  style={{ marginBottom: 16, padding: 14 }}
                >
                  <View style={styles.spaceBetween}>
                    <View style={styles.row}>
                      <Ionicons name="wine-outline" size={22} color={theme.colors.secondary} />
                      <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.text, marginLeft: 10 }}>Lounge Access</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>
              </Animated.View>
            )}

            {selectedTab === 'fare' && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                <GlassCard style={{ padding: 16 }} animated={false}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>Fare Rules</Text>
                  {(flight.fareRules || []).map((rule, idx) => (
                    <View key={idx} style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.infoLabel, { color: theme.colors.text, fontWeight: '500' }]}>{rule.type}</Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>{rule.description}</Text>
                      </View>
                      <Text style={[styles.infoValue, { color: rule.charge === 0 ? theme.colors.success : rule.charge === -1 ? theme.colors.error : theme.colors.text }]}>
                        {rule.charge === 0 ? 'Free' : rule.charge === -1 ? 'N/A' : '₹' + rule.charge.toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </GlassCard>
              </Animated.View>
            )}

            {selectedTab === 'amenities' && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                <GlassCard style={{ padding: 16 }} animated={false}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>Amenities</Text>
                  <View style={styles.amenityGrid}>
                    {flight.amenities.map((amenity, idx) => (
                      <TouchableOpacity key={idx} style={styles.amenityItem} onPress={() => haptics.light()}>
                        <Ionicons
                          name={
                            amenity.includes('Wi-Fi') ? 'wifi' :
                            amenity.includes('USB') ? 'flash' :
                            amenity.includes('Entertainment') ? 'tv' :
                            amenity.includes('Meal') ? 'restaurant' :
                            amenity.includes('Priority') ? 'star' :
                            amenity.includes('Lounge') ? 'wine' :
                            amenity.includes('Legroom') ? 'resize' :
                            'checkmark-circle'
                          }
                          size={24}
                          color={theme.colors.primary}
                        />
                        <Text style={[styles.amenityLabel, { color: theme.colors.text }]}>{amenity}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </GlassCard>
              </Animated.View>
            )}

            {selectedTab === 'baggage' && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.section}>
                <GlassCard style={{ padding: 16 }} animated={false}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>Baggage Allowance</Text>
                  {[
                    { label: 'Cabin Baggage', value: flight.baggage.cabin, icon: 'briefcase-outline', color: theme.colors.primary },
                    { label: 'Check-in Baggage', value: flight.baggage.checkedIn, icon: 'cube-outline', color: theme.colors.success },
                    { label: 'Extra Baggage', value: '₹' + flight.baggage.extraBaggagePrice + '/kg', icon: 'add-circle-outline', color: theme.colors.warning },
                  ].map((item, idx) => (
                    <View key={idx} style={[styles.listItem, { borderBottomColor: theme.colors.divider, paddingHorizontal: 0 }]}>
                      <View style={[styles.listItemIcon, { backgroundColor: item.color + '15' }]}>
                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                      </View>
                      <View style={styles.listItemContent}>
                        <Text style={[styles.listItemTitle, { color: theme.colors.text }]}>{item.label}</Text>
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>{item.value}</Text>
                    </View>
                  ))}
                </GlassCard>
              </Animated.View>
            )}

            {/* Price Breakdown */}
            <Animated.View entering={FadeInDown.duration(500).delay(200)}>
              <View style={[styles.priceBreakdown, { marginHorizontal: 16, backgroundColor: isDark ? theme.colors.surface : theme.colors.card, borderColor: theme.colors.border }]}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 12 }}>Price Breakdown</Text>
                <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Base Fare</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>₹{flight.price.base.toLocaleString()}</Text>
                </View>
                <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Taxes & Fees</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>₹{flight.price.tax.toLocaleString()}</Text>
                </View>
                {flight.price.discount && (
                  <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                    <Text style={[styles.infoLabel, { color: theme.colors.success }]}>Discount</Text>
                    <Text style={[styles.infoValue, { color: theme.colors.success }]}>-₹{flight.price.discount.toLocaleString()}</Text>
                  </View>
                )}
                <View style={[styles.totalRow, { borderColor: theme.colors.divider }]}>
                  <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
                  <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>₹{flight.price.total.toLocaleString()}</Text>
                </View>
              </View>
            </Animated.View>
          </>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomButton, { backgroundColor: isDark ? theme.colors.surface : theme.colors.background, borderTopWidth: 1, borderColor: theme.colors.border }]}>
        <View style={styles.spaceBetween}>
          <View>
            <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>Total Price</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.primary }}>₹{flight.price.total.toLocaleString()}</Text>
          </View>
          <AnimatedButton
            title="Select Seat →"
            onPress={() => {
              haptics.heavy();
              navigation.navigate('SeatSelection', { flight, seatClass: flight.cabinClass });
            }}
            variant="gradient"
            size="large"
            gradientColors={gradientPresets.primary}
          />
        </View>
      </View>

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
