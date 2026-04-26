
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
import { generateSeatMap } from '../../../data/flights';
import { Flight, Seat, SeatRow } from '../../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export const SeatSelectionScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const flight: Flight = route.params?.flight;
  const seatClass = route.params?.seatClass || 'economy';
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [loading, setLoading] = useState(true);
  const [seatMap, setSeatMap] = useState<SeatRow[]>([]);

  useEffect(() => {
    setTimeout(() => {
      const map = generateSeatMap(seatClass);
      setSeatMap(map[0]?.rows || []);
      setLoading(false);
    }, 1000);
  }, []);

  const seatColors = {
    available: theme.colors.success + '30',
    selected: theme.colors.primary,
    occupied: theme.colors.backgroundTertiary,
    premium: theme.colors.warning + '30',
  };

  const handleSelectSeat = (seat: Seat) => {
    if (!seat.available) return;
    haptics.medium();
    setSelectedSeat(seat);
  };

  const handleContinue = () => {
    if (!selectedSeat) return;
    haptics.heavy();
    navigation.navigate('PassengerDetails', { flight, seat: selectedSeat, seatClass });
  };

  return (
    <GradientBackground>
      <PremiumHeader
        title="Select Your Seat"
        subtitle={flight?.flightNumber + ' • ' + seatClass}
        onBack={() => navigation.goBack()}
        gradientColors={gradientPresets.flightCard}
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <SkeletonList count={6} />
        ) : (
          <>
            {/* Legend */}
            <Animated.View entering={FadeInDown.duration(400)}>
              <GlassCard style={{ marginHorizontal: 16, marginBottom: 16, padding: 14 }} animated={false}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 10 }}>Seat Legend</Text>
                <View style={[styles.row, { flexWrap: 'wrap' }]}>
                  {[
                    { color: seatColors.available, label: 'Available', border: theme.colors.success },
                    { color: seatColors.selected, label: 'Selected', border: theme.colors.primary },
                    { color: seatColors.occupied, label: 'Occupied', border: theme.colors.textTertiary },
                    { color: seatColors.premium, label: 'Extra Legroom', border: theme.colors.warning },
                  ].map((item, idx) => (
                    <View key={idx} style={[styles.row, { marginRight: 16, marginBottom: 6 }]}>
                      <View style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: item.color, borderWidth: 1, borderColor: item.border, marginRight: 6 }} />
                      <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </Animated.View>

            {/* Aircraft Nose */}
            <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ alignItems: 'center', marginBottom: 8 }}>
              <View style={{ width: 100, height: 40, borderTopLeftRadius: 50, borderTopRightRadius: 50, backgroundColor: isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4 }}>
                <Text style={{ fontSize: 10, color: theme.colors.textTertiary }}>FRONT</Text>
              </View>
            </Animated.View>

            {/* Column Headers */}
            <View style={[styles.row, { justifyContent: 'center', marginBottom: 8 }]}>
              {['A', 'B', 'C', '', 'D', 'E', 'F'].map((col, idx) => (
                <View key={idx} style={{ width: col === '' ? 28 : 36, alignItems: 'center', margin: 3 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.textTertiary }}>{col}</Text>
                </View>
              ))}
            </View>

            {/* Seat Grid */}
            {seatMap.map((row, rowIdx) => (
              <Animated.View key={row.rowNumber} entering={FadeInDown.duration(300).delay(rowIdx * 20)} style={[styles.row, { justifyContent: 'center', marginBottom: 4 }]}>
                {/* Row Number */}
                <Text style={{ width: 24, fontSize: 11, color: theme.colors.textTertiary, textAlign: 'right', marginRight: 4 }}>{row.rowNumber}</Text>
                {row.seats.map((seat, seatIdx) => {
                  const isSelected = selectedSeat?.id === seat.id;
                  const isExitRow = row.isExitRow;
                  return (
                    <React.Fragment key={seat.id}>
                      {seatIdx === 3 && <View style={{ width: 28 }} />}
                      <TouchableOpacity
                        onPress={() => handleSelectSeat(seat)}
                        disabled={!seat.available}
                        style={[styles.seat, {
                          backgroundColor: isSelected ? seatColors.selected : !seat.available ? seatColors.occupied : isExitRow ? seatColors.premium : seatColors.available,
                          borderColor: isSelected ? theme.colors.primary : !seat.available ? theme.colors.textTertiary : isExitRow ? theme.colors.warning : theme.colors.success,
                          opacity: seat.available ? 1 : 0.4,
                        }]}
                      >
                        <Text style={[styles.seatText, { color: isSelected ? '#FFFFFF' : theme.colors.text }]}>
                          {seat.id}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  );
                })}
              </Animated.View>
            ))}

            {/* Selected Seat Info */}
            {selectedSeat && (
              <Animated.View entering={FadeInUp.duration(400)}>
                <GlassCard style={{ marginHorizontal: 16, marginTop: 16, padding: 16 }} animated={false}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 12 }}>
                    Selected: Seat {selectedSeat.id}
                  </Text>
                  <View style={[styles.row, { flexWrap: 'wrap' }]}>
                    {[
                      { label: 'Type', value: selectedSeat.type },
                      { label: 'Legroom', value: selectedSeat.legroom },
                      { label: 'Price', value: '₹' + selectedSeat.price },
                    ].map((item, idx) => (
                      <View key={idx} style={{ width: '33%', marginBottom: 8 }}>
                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>{item.label}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text }}>{item.value}</Text>
                      </View>
                    ))}
                  </View>
                  {selectedSeat.features.length > 0 && (
                    <View style={[styles.row, { marginTop: 8 }]}>
                      {selectedSeat.features.map((feat, fIdx) => (
                        <View key={fIdx} style={[styles.tag, { backgroundColor: theme.colors.primary + '10' }]}>
                          <Text style={[styles.tagText, { color: theme.colors.primary }]}>{feat}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </GlassCard>
              </Animated.View>
            )}

            <View style={{ height: 120 }} />
          </>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      {selectedSeat && (
        <Animated.View entering={FadeInUp.duration(300)} style={[styles.bottomButton, { backgroundColor: isDark ? theme.colors.surface : theme.colors.background, borderTopWidth: 1, borderColor: theme.colors.border }]}>
          <View style={styles.spaceBetween}>
            <View>
              <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>Seat {selectedSeat.id} • {selectedSeat.type}</Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: theme.colors.primary }}>
                ₹{(flight.price.total + selectedSeat.price).toLocaleString()}
              </Text>
            </View>
            <AnimatedButton title="Continue →" onPress={handleContinue} variant="gradient" size="large" gradientColors={gradientPresets.primary} />
          </View>
        </Animated.View>
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
