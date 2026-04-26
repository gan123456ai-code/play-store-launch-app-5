
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
import { FlightBooking } from '../../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


export const FlightConfirmationScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const booking: FlightBooking = route.params?.booking;
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    haptics.success();
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scrollContent, { paddingTop: 60 }]} showsVerticalScrollIndicator={false}>
        {/* Success Animation */}
        <Animated.View entering={ZoomIn.duration(600)} style={{ alignItems: 'center', marginBottom: 24 }}>
          <LinearGradient
            colors={[theme.colors.success, '#34D399']}
            style={{ width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
          >
            <Ionicons name="checkmark" size={48} color="#FFFFFF" />
          </LinearGradient>
          <Text style={{ fontSize: 28, fontWeight: '800', color: theme.colors.text }}>Booking Confirmed! 🎉</Text>
          <Text style={{ fontSize: 15, color: theme.colors.textSecondary, marginTop: 6, textAlign: 'center' }}>
            Your flight has been booked successfully
          </Text>
        </Animated.View>

        {/* PNR Card */}
        <Animated.View entering={FadeInDown.duration(500).delay(200)}>
          <LinearGradient
            colors={gradientPresets.flightCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ marginHorizontal: 16, borderRadius: 20, padding: 24, marginBottom: 16 }}
          >
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>PNR Number</Text>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#FFFFFF', letterSpacing: 4, marginTop: 4 }}>
              {booking?.pnr || 'PNR000000'}
            </Text>
            <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            <View style={styles.spaceBetween}>
              <View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>{booking?.flight?.from?.code || 'DEL'}</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{booking?.flight?.from?.city || 'New Delhi'}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>✈️</Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{booking?.flight?.duration || '2h 30m'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>{booking?.flight?.to?.code || 'BOM'}</Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{booking?.flight?.to?.city || 'Mumbai'}</Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            <View style={[styles.row, { justifyContent: 'space-around' }]}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Flight</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>{booking?.flight?.flightNumber || 'XX-000'}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Seat</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>{booking?.seat?.id || '12A'}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Class</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>{booking?.seatClass || 'Economy'}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Amount</Text>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>₹{(booking?.totalAmount || 0).toLocaleString()}</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Passenger Info */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <GlassCard style={{ marginHorizontal: 16, marginBottom: 16, padding: 16 }} animated={false}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 12 }}>Passenger Details</Text>
            {(booking?.passengers || []).map((pax, idx) => (
              <View key={idx}>
                <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Name</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>{pax.title} {pax.firstName} {pax.lastName}</Text>
                </View>
                <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>{pax.email}</Text>
                </View>
                <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Phone</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>{pax.phone}</Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.duration(500).delay(400)} style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          {[
            { icon: '📥', label: 'Download E-Ticket', color: theme.colors.primary, onPress: () => haptics.success() },
            { icon: '📤', label: 'Share Booking', color: theme.colors.accent, onPress: () => haptics.light() },
            { icon: '📅', label: 'Add to Calendar', color: theme.colors.success, onPress: () => haptics.light() },
            { icon: '🍽️', label: 'Pre-book Meals', color: theme.colors.warning, onPress: () => { haptics.light(); navigation.navigate('MealSelection', { flight: booking?.flight, bookingId: booking?.id }); } },
            { icon: '🛡️', label: 'Add Insurance', color: theme.colors.info, onPress: () => { haptics.light(); navigation.navigate('InsuranceOptions', { flight: booking?.flight }); } },
          ].map((action, idx) => (
            <GlassCard
              key={idx}
              onPress={action.onPress}
              style={{ marginBottom: 8, padding: 14 }}
            >
              <View style={styles.spaceBetween}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>{action.icon}</Text>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: theme.colors.text }}>{action.label}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </View>
            </GlassCard>
          ))}
        </Animated.View>

        {/* Back to Home */}
        <View style={{ paddingHorizontal: 16, marginBottom: 32 }}>
          <AnimatedButton
            title="Back to Home"
            onPress={() => navigation.popToTop()}
            variant="outline"
            size="large"
            fullWidth
          />
        </View>

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
