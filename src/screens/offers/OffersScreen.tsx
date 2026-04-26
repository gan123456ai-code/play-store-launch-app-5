
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  RefreshControl, Dimensions, FlatList,
} from 'react-native';
import Animated, {
  FadeInDown, FadeInUp, FadeInRight,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import {
  GradientBackground, GlassCard, SkeletonList,
  PremiumHeader, FloatingAIButton,
} from '../../components/shared';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  category: 'flight' | 'hotel' | 'train' | 'banking' | 'recharge' | 'investment';
  validTill: string;
  minAmount: number;
  maxDiscount: number;
  termsCount: number;
  icon: string;
  gradient: string[];
  cashback: string;
  usageLimit: string;
  bankPartner?: string;
}

const offers: Offer[] = [
  { id: '1', title: 'New Year Flight Sale', description: 'Flat 40% off on domestic flights. Book now and save big on your next trip!', discount: '40% OFF', code: 'NEWYEAR40', category: 'flight', validTill: '31 Jan 2025', minAmount: 3000, maxDiscount: 5000, termsCount: 5, icon: '✈️', gradient: ['#6366F1', '#8B5CF6'], cashback: '₹500 Cashback', usageLimit: 'Once per user', bankPartner: 'HDFC' },
  { id: '2', title: 'Weekend Hotel Deals', description: 'Get up to ₹3,000 off on weekend hotel bookings across 5000+ properties', discount: '₹3,000 OFF', code: 'WEEKEND3K', category: 'hotel', validTill: '28 Feb 2025', minAmount: 5000, maxDiscount: 3000, termsCount: 4, icon: '🏨', gradient: ['#EC4899', '#F472B6'], cashback: '10% Cashback', usageLimit: 'Twice per user' },
  { id: '3', title: 'IRCTC Super Saver', description: 'Flat ₹200 off on train bookings. Valid on Sleeper, 3AC, 2AC, and 1AC classes', discount: '₹200 OFF', code: 'TRAIN200', category: 'train', validTill: '31 Mar 2025', minAmount: 500, maxDiscount: 200, termsCount: 3, icon: '🚂', gradient: ['#F59E0B', '#FBBF24'], cashback: '₹50 Cashback', usageLimit: 'Unlimited' },
  { id: '4', title: 'UPI Cashback Bonanza', description: 'Get 5% cashback up to ₹100 on all UPI transactions. Valid on all merchants', discount: '5% Cashback', code: 'UPI5BACK', category: 'banking', validTill: '15 Feb 2025', minAmount: 100, maxDiscount: 100, termsCount: 4, icon: '💰', gradient: ['#10B981', '#34D399'], cashback: 'Up to ₹100', usageLimit: 'Thrice per user' },
  { id: '5', title: 'Mobile Recharge Offer', description: 'Get ₹50 cashback on mobile recharge of ₹199 or above. Valid on all operators', discount: '₹50 Cashback', code: 'RECHARGE50', category: 'recharge', validTill: '20 Jan 2025', minAmount: 199, maxDiscount: 50, termsCount: 3, icon: '📱', gradient: ['#06B6D4', '#22D3EE'], cashback: '₹50 Direct', usageLimit: 'Once per user' },
  { id: '6', title: 'First SIP Reward', description: 'Start your first SIP of ₹500 or more and get ₹250 worth gold absolutely free!', discount: '₹250 Gold FREE', code: 'FIRSTSIP', category: 'investment', validTill: '31 Mar 2025', minAmount: 500, maxDiscount: 250, termsCount: 5, icon: '📈', gradient: ['#8B5CF6', '#A78BFA'], cashback: '₹250 in Gold', usageLimit: 'New SIP users', bankPartner: 'All Banks' },
  { id: '7', title: 'International Flight Deal', description: 'Up to ₹10,000 off on international flights. Singapore, Dubai, Thailand & more!', discount: 'Up to ₹10,000', code: 'FLYINTL10K', category: 'flight', validTill: '15 Feb 2025', minAmount: 15000, maxDiscount: 10000, termsCount: 6, icon: '🌍', gradient: ['#D946EF', '#E879F9'], cashback: '₹1,000 Extra', usageLimit: 'Once per user', bankPartner: 'ICICI' },
  { id: '8', title: 'Luxury Hotel Upgrade', description: 'Free room upgrade to Deluxe/Premium when booking through TravelBank Ultra', discount: 'Free Upgrade', code: 'LUXURY2025', category: 'hotel', validTill: '28 Feb 2025', minAmount: 8000, maxDiscount: 5000, termsCount: 4, icon: '👑', gradient: ['#CA8A04', '#EAB308'], cashback: 'Room Upgrade', usageLimit: 'Limited' },
  { id: '9', title: 'Bill Pay Cashback', description: 'Pay electricity, water, or gas bills and get flat 3% cashback up to ₹200', discount: '3% Cashback', code: 'BILLPAY3', category: 'banking', validTill: '31 Jan 2025', minAmount: 500, maxDiscount: 200, termsCount: 3, icon: '⚡', gradient: ['#EF4444', '#F87171'], cashback: 'Up to ₹200', usageLimit: 'Thrice per month' },
  { id: '10', title: 'Gold Investment Offer', description: 'Zero making charges on digital gold purchase above ₹5,000. Limited time offer!', discount: 'Zero Charges', code: 'GOLDNOW', category: 'investment', validTill: '28 Feb 2025', minAmount: 5000, maxDiscount: 1000, termsCount: 4, icon: '🪙', gradient: ['#D97706', '#F59E0B'], cashback: 'No Making Charges', usageLimit: 'Unlimited' },
  { id: '11', title: 'Credit Card Special', description: 'Get 10X reward points on all travel bookings made via HDFC credit card', discount: '10X Points', code: 'HDFC10X', category: 'banking', validTill: '31 Mar 2025', minAmount: 1000, maxDiscount: 0, termsCount: 5, icon: '💳', gradient: ['#004B87', '#0077C8'], cashback: '10X Reward Points', usageLimit: 'No Limit', bankPartner: 'HDFC' },
  { id: '12', title: 'Bus Travel Discount', description: 'Flat 15% off on AC bus bookings for routes over 300km. All operators included', discount: '15% OFF', code: 'BUSRIDE15', category: 'train', validTill: '28 Feb 2025', minAmount: 400, maxDiscount: 300, termsCount: 3, icon: '🚌', gradient: ['#059669', '#10B981'], cashback: '₹75 Cashback', usageLimit: 'Twice per user' },
];

const categoryFilters = [
  { id: 'all', label: 'All Offers', icon: '🎁' },
  { id: 'flight', label: 'Flights', icon: '✈️' },
  { id: 'hotel', label: 'Hotels', icon: '🏨' },
  { id: 'train', label: 'Transport', icon: '🚂' },
  { id: 'banking', label: 'Banking', icon: '💳' },
  { id: 'recharge', label: 'Recharge', icon: '📱' },
  { id: 'investment', label: 'Invest', icon: '📈' },
];

export const OffersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const { addToHistory } = useApp();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1200);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredOffers = selectedCategory === 'all' ? offers : offers.filter(o => o.category === selectedCategory);

  const handleCopyCode = useCallback((code: string) => {
    haptics.success();
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, [haptics]);

  return (
    <GradientBackground>
      <PremiumHeader title="Offers & Deals" subtitle="🎁 Exclusive discounts for you" onBack={() => navigation.goBack()} transparent />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Banner */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <LinearGradient colors={['#6366F1', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
            <Text style={styles.bannerEmoji}>🎉</Text>
            <Text style={styles.bannerTitle}>Mega Sale Live!</Text>
            <Text style={styles.bannerSubtitle}>Up to 50% off on flights + extra bank cashback</Text>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>Limited Time</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            {categoryFilters.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => { haptics.selection(); setSelectedCategory(cat.id); }}
                style={[styles.filterChip, {
                  backgroundColor: selectedCategory === cat.id ? theme.colors.primary : 'transparent',
                  borderColor: selectedCategory === cat.id ? theme.colors.primary : theme.colors.border,
                }]}
              >
                <Text style={{ fontSize: 14 }}>{cat.icon}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', marginLeft: 6, color: selectedCategory === cat.id ? '#FFFFFF' : theme.colors.textSecondary }}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {loading ? (
          <SkeletonList count={6} />
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            <Text style={[styles.resultCount, { color: theme.colors.textSecondary }]}>
              {filteredOffers.length} offer{filteredOffers.length !== 1 ? 's' : ''} available
            </Text>
            {filteredOffers.map((offer, idx) => (
              <Animated.View key={offer.id} entering={FadeInDown.duration(300).delay(idx * 50)}>
                <GlassCard
                  onPress={() => {
                    haptics.medium();
                    setExpandedOffer(expandedOffer === offer.id ? null : offer.id);
                  }}
                  style={{ marginBottom: 12, padding: 0, overflow: 'hidden' }}
                >
                  {/* Offer Header */}
                  <LinearGradient colors={offer.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.offerHeader}>
                    <View style={styles.offerHeaderLeft}>
                      <Text style={styles.offerIcon}>{offer.icon}</Text>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={styles.offerDiscount}>{offer.discount}</Text>
                        <Text style={styles.offerCashback}>{offer.cashback}</Text>
                      </View>
                    </View>
                    {offer.bankPartner && (
                      <View style={styles.bankBadge}>
                        <Text style={styles.bankBadgeText}>{offer.bankPartner}</Text>
                      </View>
                    )}
                  </LinearGradient>

                  {/* Offer Body */}
                  <View style={{ padding: 14 }}>
                    <Text style={[styles.offerTitle, { color: theme.colors.text }]}>{offer.title}</Text>
                    <Text style={[styles.offerDesc, { color: theme.colors.textSecondary }]}>{offer.description}</Text>

                    {/* Code */}
                    <View style={[styles.codeRow, { borderColor: theme.colors.border }]}>
                      <View style={styles.codeLeft}>
                        <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>Use Code</Text>
                        <Text style={[styles.codeText, { color: theme.colors.primary }]}>{offer.code}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleCopyCode(offer.code)}
                        style={[styles.copyBtn, { backgroundColor: theme.colors.primary + '10' }]}
                      >
                        <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.primary }}>
                          {copiedCode === offer.code ? '✓ Copied' : 'Copy'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Quick Info */}
                    <View style={styles.quickInfo}>
                      <View style={styles.quickInfoItem}>
                        <Ionicons name="calendar-outline" size={14} color={theme.colors.textTertiary} />
                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginLeft: 4 }}>Till {offer.validTill}</Text>
                      </View>
                      <View style={styles.quickInfoItem}>
                        <Ionicons name="cash-outline" size={14} color={theme.colors.textTertiary} />
                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginLeft: 4 }}>Min ₹{offer.minAmount}</Text>
                      </View>
                      <View style={styles.quickInfoItem}>
                        <Ionicons name="people-outline" size={14} color={theme.colors.textTertiary} />
                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginLeft: 4 }}>{offer.usageLimit}</Text>
                      </View>
                    </View>

                    {/* Expanded Details */}
                    {expandedOffer === offer.id && (
                      <Animated.View entering={FadeInDown.duration(300)} style={[styles.expandedSection, { borderTopColor: theme.colors.divider }]}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 }}>Terms & Conditions</Text>
                        {Array.from({ length: offer.termsCount }, (_, i) => (
                          <View key={i} style={styles.termRow}>
                            <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>•</Text>
                            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginLeft: 8, flex: 1 }}>
                              {[
                                'Offer valid for select users on the TravelBank Ultra app only.',
                                'Maximum discount of ₹' + offer.maxDiscount.toLocaleString() + ' per transaction.',
                                'Minimum booking/transaction amount of ₹' + offer.minAmount.toLocaleString() + ' required.',
                                'Cannot be combined with other offers or promotional codes.',
                                'TravelBank reserves the right to modify or cancel this offer at any time.',
                                'Cashback will be credited within 48 hours of successful transaction.',
                              ][i % 6]}
                            </Text>
                          </View>
                        ))}
                      </Animated.View>
                    )}
                  </View>
                </GlassCard>
              </Animated.View>
            ))}
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
  banner: { marginHorizontal: 16, marginTop: 8, borderRadius: 20, padding: 24, alignItems: 'center' },
  bannerEmoji: { fontSize: 48, marginBottom: 8 },
  bannerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  bannerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4, textAlign: 'center' },
  bannerBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 12 },
  bannerBadgeText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  resultCount: { fontSize: 13, marginBottom: 12 },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  offerHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  offerIcon: { fontSize: 28 },
  offerDiscount: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  offerCashback: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  bankBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  bankBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  offerTitle: { fontSize: 16, fontWeight: '700' },
  offerDesc: { fontSize: 13, lineHeight: 20, marginTop: 4 },
  codeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, padding: 10, borderRadius: 10, borderWidth: 1, borderStyle: 'dashed' },
  codeLeft: {},
  codeText: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  copyBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  quickInfo: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  quickInfoItem: { flexDirection: 'row', alignItems: 'center' },
  expandedSection: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  termRow: { flexDirection: 'row', marginBottom: 6, paddingRight: 8 },
});
