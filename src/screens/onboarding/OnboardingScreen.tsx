
import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  Dimensions, FlatList, Image, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming,
  FadeInDown, FadeInUp, FadeInRight, ZoomIn, interpolate,
  useAnimatedScrollHandler, SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingPage {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  gradient: string[];
  features: Array<{ icon: string; title: string; description: string }>;
}

const pages: OnboardingPage[] = [
  {
    id: 'welcome', title: 'Welcome to TravelBank Ultra', subtitle: 'Your Premium Travel & Banking Companion', emoji: '✈️🏦',
    description: 'Experience the most advanced travel booking and banking management platform. All your financial and travel needs in one beautifully designed app.',
    gradient: ['#6366F1', '#8B5CF6', '#A78BFA'],
    features: [
      { icon: '✈️', title: 'Flight Booking', description: 'Search 500+ airlines for the best deals and book instantly' },
      { icon: '🏨', title: 'Hotel Reservations', description: 'Browse 1M+ properties worldwide with exclusive discounts' },
      { icon: '🏦', title: 'Smart Banking', description: 'Manage accounts, send money, and track investments' },
      { icon: '🤖', title: 'AI Assistant', description: 'Get personalized recommendations powered by AI' },
    ],
  },
  {
    id: 'travel', title: 'Travel Like Royalty', subtitle: 'Book Flights, Hotels & Trains', emoji: '🌍',
    description: 'Search across hundreds of airlines, hotels, and transport options. Get the best prices with our smart price comparison engine.',
    gradient: ['#EC4899', '#F472B6', '#F9A8D4'],
    features: [
      { icon: '🔍', title: 'Smart Search', description: 'AI-powered search finds the best prices across all providers' },
      { icon: '💰', title: 'Price Alerts', description: 'Get notified when prices drop for your favorite routes' },
      { icon: '🗺️', title: 'Trip Planner', description: 'Plan complete itineraries with maps and timelines' },
      { icon: '📋', title: 'Booking Manager', description: 'Manage all bookings in one place with easy modifications' },
      { icon: '⭐', title: 'Reviews & Ratings', description: 'Read verified reviews from real travelers' },
      { icon: '🎁', title: 'Rewards', description: 'Earn points on every booking and redeem for discounts' },
    ],
  },
  {
    id: 'banking', title: 'Banking Reimagined', subtitle: 'Smart, Secure & Instant', emoji: '💳',
    description: 'Next-generation banking with instant transfers, smart bill payments, and intelligent investment management. Your money works harder.',
    gradient: ['#10B981', '#34D399', '#6EE7B7'],
    features: [
      { icon: '💸', title: 'Instant Transfers', description: 'Send money via UPI, NEFT, IMPS in seconds' },
      { icon: '📊', title: 'Smart Analytics', description: 'Track spending patterns with beautiful visualizations' },
      { icon: '📈', title: 'Investments', description: 'Mutual Funds, FDs, Gold - all in one place' },
      { icon: '🔔', title: 'Bill Reminders', description: 'Never miss a bill payment with smart reminders' },
      { icon: '🛡️', title: 'Bank-Grade Security', description: 'Multi-layer encryption and biometric authentication' },
      { icon: '🧮', title: 'Tax Planner', description: 'Calculate and optimize your tax savings' },
    ],
  },
  {
    id: 'features', title: 'Premium Features', subtitle: 'Designed for the Best Experience', emoji: '💎',
    description: 'Enjoy a premium experience with glassmorphism UI, smooth animations, dark mode, and an AI assistant that learns your preferences.',
    gradient: ['#F59E0B', '#FBBF24', '#FCD34D'],
    features: [
      { icon: '🌙', title: 'Dark Mode', description: 'Beautiful dark theme that is easy on the eyes' },
      { icon: '🎨', title: 'Glassmorphism UI', description: 'Modern frosted glass design with smooth animations' },
      { icon: '📱', title: 'Offline Mode', description: 'Access your data even without internet connection' },
      { icon: '🔐', title: 'Biometric Login', description: 'Fingerprint and Face ID for quick secure access' },
      { icon: '🤖', title: 'AI Powered', description: 'Smart suggestions based on your usage patterns' },
      { icon: '🌐', title: 'Multi-Language', description: 'Support for 12+ languages including Hindi' },
      { icon: '💱', title: 'Multi-Currency', description: 'View prices in your preferred currency' },
      { icon: '📊', title: 'Widgets', description: 'Home screen widgets for quick access' },
    ],
  },
];

const AnimatedPage: React.FC<{ page: OnboardingPage; index: number; scrollX: SharedValue<number> }> = ({ page, index, scrollX }) => {
  const { theme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
    const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5]);
    const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8]);
    return { opacity, transform: [{ scale }] };
  });

  return (
    <View style={{ width: SCREEN_WIDTH }}>
      <Animated.View style={[styles.pageContent, animatedStyle]}>
        <LinearGradient colors={page.gradient} style={styles.emojiContainer}>
          <Text style={styles.pageEmoji}>{page.emoji}</Text>
        </LinearGradient>
        <Text style={[styles.pageTitle, { color: theme.colors.text }]}>{page.title}</Text>
        <Text style={[styles.pageSubtitle, { color: theme.colors.primary }]}>{page.subtitle}</Text>
        <Text style={[styles.pageDescription, { color: theme.colors.textSecondary }]}>{page.description}</Text>

        <View style={styles.featuresContainer}>
          {page.features.map((feature, fIdx) => (
            <Animated.View key={fIdx} entering={FadeInDown.duration(400).delay(fIdx * 100)}>
              <View style={[styles.featureCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                <View style={[styles.featureIcon, { backgroundColor: page.gradient[0] + '15' }]}>
                  <Text style={{ fontSize: 22 }}>{feature.icon}</Text>
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
                  <Text style={[styles.featureDesc, { color: theme.colors.textSecondary }]}>{feature.description}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

export const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = useCallback(() => {
    if (currentPage < pages.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage]);

  const handleSkip = useCallback(() => {
    // Navigate to main app
  }, []);

  const handleGetStarted = useCallback(() => {
    // Navigate to main app
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>TravelBank Ultra</Text>
        {currentPage < pages.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Page Indicators */}
      <View style={styles.indicators}>
        {pages.map((_, idx) => {
          const indicatorStyle = useAnimatedStyle(() => {
            const inputRange = [(idx - 1) * SCREEN_WIDTH, idx * SCREEN_WIDTH, (idx + 1) * SCREEN_WIDTH];
            const width = interpolate(scrollX.value, inputRange, [8, 24, 8]);
            const opacity = interpolate(scrollX.value, inputRange, [0.3, 1, 0.3]);
            return { width, opacity };
          });
          return (
            <Animated.View
              key={idx}
              style={[styles.indicator, { backgroundColor: theme.colors.primary }, indicatorStyle]}
            />
          );
        })}
      </View>

      {/* Pages */}
      <Animated.FlatList
        ref={flatListRef}
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentPage(page);
        }}
        renderItem={({ item, index }) => (
          <ScrollView style={{ width: SCREEN_WIDTH }} showsVerticalScrollIndicator={false}>
            <AnimatedPage page={item} index={index} scrollX={scrollX} />
          </ScrollView>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + 16 }]}>
        {currentPage < pages.length - 1 ? (
          <TouchableOpacity onPress={handleNext} activeOpacity={0.9}>
            <LinearGradient
              colors={pages[currentPage].gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.9}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.getStartedButton}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <Ionicons name="rocket" size={22} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  indicators: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 12 },
  indicator: { height: 4, borderRadius: 2, marginHorizontal: 4 },
  pageContent: { padding: 20, alignItems: 'center' },
  emojiContainer: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  pageEmoji: { fontSize: 44 },
  pageTitle: { fontSize: 28, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginTop: 8 },
  pageDescription: { fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 12, paddingHorizontal: 16 },
  featuresContainer: { marginTop: 24, width: '100%' },
  featureCard: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 16, marginBottom: 10, borderWidth: 1 },
  featureIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1, marginLeft: 14 },
  featureTitle: { fontSize: 15, fontWeight: '700' },
  featureDesc: { fontSize: 12, marginTop: 2, lineHeight: 18 },
  bottomActions: { paddingHorizontal: 20 },
  nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  nextButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginRight: 8 },
  getStartedButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 16 },
  getStartedText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginRight: 10 },
});
