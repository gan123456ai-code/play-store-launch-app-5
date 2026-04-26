
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
import { Flight, Seat, PassengerInfo } from '../../../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const paymentMethods = [
  { id: 'upi', label: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
  { id: 'credit', label: 'Credit Card', icon: '💳', description: 'Visa, Mastercard, Amex, RuPay' },
  { id: 'debit', label: 'Debit Card', icon: '🏧', description: 'All major banks supported' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', description: 'All major banks' },
  { id: 'wallet', label: 'Wallets', icon: '👛', description: 'Paytm, MobiKwik, FreeCharge' },
  { id: 'emi', label: 'EMI', icon: '📅', description: 'No-cost EMI available' },
];

const promoOffers = [
  { code: 'FIRST500', discount: 500, description: 'Flat ₹500 off on first booking' },
  { code: 'HDFC10', discount: 10, description: '10% off with HDFC Credit Card', isPercent: true },
  { code: 'TRAVEL20', discount: 20, description: '20% off up to ₹2,000', isPercent: true },
];

export const FlightPaymentScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const flight: Flight = route.params?.flight;
  const seat: Seat = route.params?.seat;
  const passenger: PassengerInfo = route.params?.passenger;
  const seatClass = route.params?.seatClass;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof promoOffers[0] | null>(null);
  const [processing, setProcessing] = useState(false);
  const [addInsurance, setAddInsurance] = useState(false);

  const baseAmount = (flight?.price?.total || 0) + (seat?.price || 0);
  const insuranceAmount = addInsurance ? 599 : 0;
  const discount = appliedPromo ? (appliedPromo.isPercent ? Math.min(Math.floor(baseAmount * appliedPromo.discount / 100), 2000) : appliedPromo.discount) : 0;
  const totalAmount = baseAmount + insuranceAmount - discount;

  const handleApplyPromo = () => {
    const promo = promoOffers.find(p => p.code === promoCode.toUpperCase());
    if (promo) {
      haptics.success();
      setAppliedPromo(promo);
    } else {
      haptics.error();
      Alert.alert('Invalid Code', 'This promo code is not valid');
    }
  };

  const handlePay = () => {
    haptics.heavy();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      haptics.success();
      navigation.navigate('FlightConfirmation', {
        booking: {
          id: 'FB-' + Date.now(),
          pnr: 'PNR' + Math.random().toString(36).substr(2, 6).toUpperCase(),
          flight,
          passengers: [passenger],
          seat,
          seatClass,
          status: 'confirmed',
          totalAmount,
          paymentMethod: selectedMethod,
          bookingDate: new Date().toISOString().split('T')[0],
          addons: [],
        },
      });
    }, 3000);
  };

  return (
    <GradientBackground>
      <PremiumHeader
        title="Payment"
        subtitle="Step 4 of 5 • Secure checkout"
        onBack={() => navigation.goBack()}
        gradientColors={gradientPresets.flightCard}
      />

      {processing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.text, marginTop: 20 }}>Processing Payment...</Text>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 8 }}>Please don't close the app</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} contentContainerStyle={[styles.scrollContent, { padding: 16 }]} showsVerticalScrollIndicator={false}>
          {/* Step Indicator */}
          <View style={[styles.stepIndicator, { marginBottom: 16 }]}>
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <View style={[styles.stepDot, { backgroundColor: step <= 4 ? theme.colors.primary : theme.colors.border }]} />
                {step < 5 && <View style={[styles.stepLine, { backgroundColor: step < 4 ? theme.colors.primary : theme.colors.border }]} />}
              </React.Fragment>
            ))}
          </View>

          {/* Promo Code */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <GlassCard style={{ marginBottom: 16, padding: 16 }} animated={false}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 12 }}>🎫 Promo Code</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0, marginRight: 8, borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                  value={promoCode}
                  onChangeText={setPromoCode}
                  placeholder="Enter promo code"
                  placeholderTextColor={theme.colors.textTertiary}
                  autoCapitalize="characters"
                />
                <AnimatedButton title="Apply" onPress={handleApplyPromo} variant="primary" size="medium" />
              </View>
              {appliedPromo && (
                <View style={[styles.row, { marginTop: 8, backgroundColor: theme.colors.success + '15', padding: 10, borderRadius: 10 }]}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                  <Text style={{ fontSize: 13, color: theme.colors.success, marginLeft: 6, fontWeight: '500' }}>
                    {appliedPromo.code} applied! You save ₹{discount.toLocaleString()}
                  </Text>
                </View>
              )}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {promoOffers.map((offer, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => { haptics.light(); setPromoCode(offer.code); }}
                    style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: theme.colors.primary + '10', marginRight: 8 }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '600', color: theme.colors.primary }}>{offer.code}</Text>
                    <Text style={{ fontSize: 10, color: theme.colors.textSecondary }}>{offer.description}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </GlassCard>
          </Animated.View>

          {/* Travel Insurance */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)}>
            <GlassCard style={{ marginBottom: 16, padding: 16 }} animated={false}>
              <View style={styles.spaceBetween}>
                <View style={styles.row}>
                  <Ionicons name="shield-checkmark" size={22} color={theme.colors.success} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text }}>Travel Insurance</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>₹599 • Covers trip cancellation & medical</Text>
                  </View>
                </View>
                <Switch
                  value={addInsurance}
                  onValueChange={(v) => { haptics.selection(); setAddInsurance(v); }}
                  trackColor={{ true: theme.colors.success, false: theme.colors.border }}
                />
              </View>
            </GlassCard>
          </Animated.View>

          {/* Payment Methods */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <GlassCard style={{ marginBottom: 16, padding: 16 }} animated={false}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>Payment Method</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  onPress={() => { haptics.selection(); setSelectedMethod(method.id); }}
                  style={[styles.listItem, {
                    borderBottomColor: theme.colors.divider,
                    paddingHorizontal: 0,
                    backgroundColor: selectedMethod === method.id ? theme.colors.primary + '08' : 'transparent',
                    borderRadius: 12,
                    marginBottom: 4,
                    paddingHorizontal: 12,
                  }]}
                >
                  <View style={[styles.radioOuter, { borderColor: selectedMethod === method.id ? theme.colors.primary : theme.colors.border }]}>
                    {selectedMethod === method.id && <View style={[styles.radioInner, { backgroundColor: theme.colors.primary }]} />}
                  </View>
                  <Text style={{ fontSize: 22, marginRight: 12 }}>{method.icon}</Text>
                  <View style={styles.listItemContent}>
                    <Text style={[styles.listItemTitle, { color: theme.colors.text }]}>{method.label}</Text>
                    <Text style={[styles.listItemSubtitle, { color: theme.colors.textSecondary }]}>{method.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* UPI Input */}
              {selectedMethod === 'upi' && (
                <Animated.View entering={FadeInDown.duration(300)} style={{ marginTop: 12 }}>
                  <Text style={[styles.label, { color: theme.colors.textSecondary }]}>UPI ID</Text>
                  <TextInput
                    style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                    value={upiId}
                    onChangeText={setUpiId}
                    placeholder="yourname@upi"
                    placeholderTextColor={theme.colors.textTertiary}
                    autoCapitalize="none"
                  />
                </Animated.View>
              )}

              {/* Card Input */}
              {(selectedMethod === 'credit' || selectedMethod === 'debit') && (
                <Animated.View entering={FadeInDown.duration(300)} style={{ marginTop: 12 }}>
                  <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Card Number</Text>
                    <TextInput
                      style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      placeholder="XXXX XXXX XXXX XXXX"
                      placeholderTextColor={theme.colors.textTertiary}
                      keyboardType="number-pad"
                      maxLength={19}
                    />
                  </View>
                  <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Expiry</Text>
                      <TextInput
                        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                        placeholder="MM/YY"
                        placeholderTextColor={theme.colors.textTertiary}
                        keyboardType="number-pad"
                        maxLength={5}
                      />
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={[styles.label, { color: theme.colors.textSecondary }]}>CVV</Text>
                      <TextInput
                        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        placeholder="•••"
                        placeholderTextColor={theme.colors.textTertiary}
                        keyboardType="number-pad"
                        maxLength={4}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </Animated.View>
              )}
            </GlassCard>
          </Animated.View>

          {/* Price Breakdown */}
          <Animated.View entering={FadeInDown.duration(400).delay(150)}>
            <View style={[styles.priceBreakdown, { backgroundColor: isDark ? theme.colors.surface : theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 12 }}>Price Summary</Text>
              <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Flight Fare</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>₹{(flight?.price?.total || 0).toLocaleString()}</Text>
              </View>
              <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Seat ({seat?.id})</Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>₹{(seat?.price || 0).toLocaleString()}</Text>
              </View>
              {addInsurance && (
                <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                  <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Travel Insurance</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.text }]}>₹599</Text>
                </View>
              )}
              {discount > 0 && (
                <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
                  <Text style={[styles.infoLabel, { color: theme.colors.success }]}>Promo Discount</Text>
                  <Text style={[styles.infoValue, { color: theme.colors.success }]}>-₹{discount.toLocaleString()}</Text>
                </View>
              )}
              <View style={[styles.totalRow, { borderColor: theme.colors.divider }]}>
                <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total Amount</Text>
                <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>₹{totalAmount.toLocaleString()}</Text>
              </View>
            </View>
          </Animated.View>

          {/* Security Notice */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <View style={[styles.row, { padding: 12, backgroundColor: theme.colors.info + '10', borderRadius: 12, marginBottom: 16 }]}>
              <Ionicons name="lock-closed" size={18} color={theme.colors.info} />
              <Text style={{ fontSize: 12, color: theme.colors.info, marginLeft: 8, flex: 1 }}>
                Your payment is secured with 256-bit SSL encryption. We never store your card details.
              </Text>
            </View>
          </Animated.View>

          <View style={{ height: 120 }} />
        </ScrollView>
      )}

      {/* Bottom CTA */}
      {!processing && (
        <View style={[styles.bottomButton, { backgroundColor: isDark ? theme.colors.surface : theme.colors.background, borderTopWidth: 1, borderColor: theme.colors.border }]}>
          <AnimatedButton
            title={'Pay ₹' + totalAmount.toLocaleString()}
            onPress={handlePay}
            variant="gradient"
            size="large"
            fullWidth
            gradientColors={gradientPresets.primary}
            icon={<Ionicons name="lock-closed" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />}
          />
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
