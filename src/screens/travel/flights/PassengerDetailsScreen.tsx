
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


export const PassengerDetailsScreen: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const flight: Flight = route.params?.flight;
  const seat: Seat = route.params?.seat;
  const seatClass = route.params?.seatClass;
  const [title, setTitle] = useState('Mr');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [nationality, setNationality] = useState('Indian');
  const [passport, setPassport] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [ffNumber, setFfNumber] = useState('');
  const [mealPref, setMealPref] = useState('Veg');
  const [specialAssist, setSpecialAssist] = useState<string[]>([]);
  const [showTitlePicker, setShowTitlePicker] = useState(false);

  const titles = ['Mr', 'Mrs', 'Ms', 'Dr', 'Master', 'Miss'];
  const mealPrefs = ['Veg', 'Non-Veg', 'Vegan', 'Jain', 'No Preference'];
  const assistOptions = ['Wheelchair', 'Blind', 'Deaf', 'Elderly', 'Pregnant'];
  const isInternational = flight?.from?.country !== flight?.to?.country;

  const isValid = firstName.trim() && lastName.trim() && email.trim() && phone.trim();

  const handleContinue = () => {
    if (!isValid) {
      haptics.error();
      Alert.alert('Missing Details', 'Please fill in all required fields');
      return;
    }
    haptics.heavy();
    const passenger: PassengerInfo = {
      id: 'P001',
      title,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dateOfBirth: dob,
      nationality,
      passportNumber: passport || undefined,
      passportExpiry: passportExpiry || undefined,
      frequentFlyerNumber: ffNumber || undefined,
      specialAssistance: specialAssist.length > 0 ? specialAssist : undefined,
      mealPreference: mealPref,
    };
    navigation.navigate('FlightPayment', { flight, seat, passenger, seatClass });
  };

  return (
    <GradientBackground>
      <PremiumHeader
        title="Passenger Details"
        subtitle="Step 3 of 5"
        onBack={() => navigation.goBack()}
        gradientColors={gradientPresets.flightCard}
      />

      <ScrollView style={styles.content} contentContainerStyle={[styles.scrollContent, { padding: 16 }]} showsVerticalScrollIndicator={false}>
        {/* Step Indicator */}
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.stepIndicator, { marginBottom: 16 }]}>
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <View style={[styles.stepDot, { backgroundColor: step <= 3 ? theme.colors.primary : theme.colors.border }]} />
              {step < 5 && <View style={[styles.stepLine, { backgroundColor: step < 3 ? theme.colors.primary : theme.colors.border }]} />}
            </React.Fragment>
          ))}
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <GlassCard style={{ marginBottom: 16, padding: 16 }} animated={false}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>Personal Information</Text>

            {/* Title Selector */}
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Title *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {titles.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => { haptics.selection(); setTitle(t); }}
                  style={[styles.chip, { backgroundColor: title === t ? theme.colors.primary : 'transparent', borderColor: title === t ? theme.colors.primary : theme.colors.border }]}
                >
                  <Text style={[styles.chipText, { color: title === t ? '#FFFFFF' : theme.colors.textSecondary }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Name Fields */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>First Name *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Last Name *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Email *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Phone *</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                value={phone}
                onChangeText={setPhone}
                placeholder="+91 XXXXX XXXXX"
                placeholderTextColor={theme.colors.textTertiary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Date of Birth</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                value={dob}
                onChangeText={setDob}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
          </GlassCard>
        </Animated.View>

        {/* Passport (for international) */}
        {isInternational && (
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <GlassCard style={{ marginBottom: 16, padding: 16 }} animated={false}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>
                🛂 Passport Details
              </Text>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Passport Number</Text>
                <TextInput
                  style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                  value={passport}
                  onChangeText={setPassport}
                  placeholder="Enter passport number"
                  placeholderTextColor={theme.colors.textTertiary}
                  autoCapitalize="characters"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Passport Expiry</Text>
                <TextInput
                  style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                  value={passportExpiry}
                  onChangeText={setPassportExpiry}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={theme.colors.textTertiary}
                />
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* Preferences */}
        <Animated.View entering={FadeInDown.duration(400).delay(150)}>
          <GlassCard style={{ marginBottom: 16, padding: 16 }} animated={false}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>Preferences</Text>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Meal Preference</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {mealPrefs.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => { haptics.selection(); setMealPref(m); }}
                  style={[styles.chip, { backgroundColor: mealPref === m ? theme.colors.primary : 'transparent', borderColor: mealPref === m ? theme.colors.primary : theme.colors.border }]}
                >
                  <Text style={[styles.chipText, { color: mealPref === m ? '#FFFFFF' : theme.colors.textSecondary }]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Frequent Flyer Number</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text, backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary }]}
                value={ffNumber}
                onChangeText={setFfNumber}
                placeholder="Enter FF number (optional)"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>

            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Special Assistance</Text>
            <View style={[styles.row, { flexWrap: 'wrap' }]}>
              {assistOptions.map((opt) => {
                const selected = specialAssist.includes(opt);
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => {
                      haptics.selection();
                      setSpecialAssist(selected ? specialAssist.filter(a => a !== opt) : [...specialAssist, opt]);
                    }}
                    style={[styles.chip, { backgroundColor: selected ? theme.colors.primary : 'transparent', borderColor: selected ? theme.colors.primary : theme.colors.border, marginBottom: 8 }]}
                  >
                    <Text style={[styles.chipText, { color: selected ? '#FFFFFF' : theme.colors.textSecondary }]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Flight Summary */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <GlassCard style={{ marginBottom: 16, padding: 16 }} animated={false}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 12 }}>Flight Summary</Text>
            <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Flight</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{flight?.flightNumber}</Text>
            </View>
            <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Route</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{flight?.from?.code} → {flight?.to?.code}</Text>
            </View>
            <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Seat</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{seat?.id} ({seat?.type})</Text>
            </View>
            <View style={[styles.infoRow, { borderColor: theme.colors.divider }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Class</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{seatClass}</Text>
            </View>
          </GlassCard>
        </Animated.View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomButton, { backgroundColor: isDark ? theme.colors.surface : theme.colors.background, borderTopWidth: 1, borderColor: theme.colors.border }]}>
        <AnimatedButton
          title="Continue to Payment →"
          onPress={handleContinue}
          variant="gradient"
          size="large"
          fullWidth
          disabled={!isValid}
          gradientColors={gradientPresets.primary}
        />
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
