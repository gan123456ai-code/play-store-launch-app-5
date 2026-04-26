
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  RefreshControl, FlatList, TextInput, Dimensions, Image,
  ActivityIndicator, Alert, Switch, Platform, StatusBar,
  KeyboardAvoidingView, Modal,
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
import {
  GradientBackground, GlassCard, NeumorphicCard,
  SkeletonLoader, SkeletonCard, SkeletonList,
  AnimatedButton, PremiumHeader, SearchBar,
  FloatingAIButton, EmptyState,
} from '../../components/shared';
import { gradientPresets } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');





export const RetirementPlannerScreen: React.FC<{ navigation: any; route?: any }> = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite, addToHistory } = useApp();
  const haptics = useHaptics();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [currentAge, setCurrentAge] = useState('');
  const [retireAge, setRetireAge] = useState('');
  const [monthlyExpense, setMonthlyExpense] = useState('');
  
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200 + Math.random() * 800);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleAction = useCallback((action: string) => {
    haptics.medium();
    addToHistory(action);
    
  }, [haptics, navigation]);

  const handleProcess = useCallback(() => {
    haptics.heavy();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
      haptics.success();
      setTimeout(() => {
        setShowSuccess(false);
        navigation.goBack();
      }, 2000);
    }, 2500);
  }, [haptics, navigation]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'history', label: 'History', icon: '📜' },
  ];

  const filters = ['all', 'popular', 'recent', 'trending', 'premium'];

  if (processing) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Animated.View entering={FadeInUp.duration(400).delay(200)}>
            <Text style={[styles.processingTitle, { color: theme.colors.text }]}>Processing...</Text>
            <Text style={[styles.processingSubtitle, { color: theme.colors.textSecondary }]}>Please wait while we complete your request</Text>
          </Animated.View>
        </View>
      </GradientBackground>
    );
  }

  if (showSuccess) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <Animated.View entering={ZoomIn.duration(600)} style={styles.successCircle}>
            <LinearGradient colors={[theme.colors.success, '#34D399']} style={styles.successGradient}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
          <Animated.View entering={FadeInUp.duration(400).delay(300)}>
            <Text style={[styles.successTitle, { color: theme.colors.text }]}>Success! 🎉</Text>
            <Text style={[styles.successSubtitle, { color: theme.colors.textSecondary }]}>Your action has been completed successfully</Text>
          </Animated.View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <PremiumHeader
        title="Retirement"
        subtitle="🌴 Premium Experience"
        onBack={() => navigation.goBack()}
        transparent
      />

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tab Selector */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 12 }}>
              {tabs.map((tab, idx) => (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => { haptics.selection(); setSelectedTab(idx); }}
                  style={[styles.tab, { backgroundColor: selectedTab === idx ? theme.colors.primary : isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary }]}
                >
                  <Text style={[styles.tabText, { color: selectedTab === idx ? '#FFFFFF' : theme.colors.textSecondary }]}>{tab.icon} {tab.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Filter Chips */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 16 }}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => { haptics.selection(); setSelectedFilter(filter); }}
                  style={[styles.filterChip, {
                    backgroundColor: selectedFilter === filter ? theme.colors.primary : 'transparent',
                    borderColor: selectedFilter === filter ? theme.colors.primary : theme.colors.border,
                  }]}
                >
                  <Text style={[styles.filterChipText, { color: selectedFilter === filter ? '#FFFFFF' : theme.colors.textSecondary }]}>
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {loading ? (
            <SkeletonList count={6} />
          ) : (
            <>
              
              {/* Retirement Projection Section */}
              <Animated.View entering={FadeInDown.duration(400).delay(100)}>
                <GlassCard style={{ marginHorizontal: 16, marginBottom: 16, padding: 16 }} animated={false}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>
                    📊 Retirement Projection
                  </Text>
                  
                  <View style={[styles.infoRow, { borderBottomColor: theme.colors.divider }]}>
                    <View style={styles.row}>
                      <View style={[styles.infoIcon, { backgroundColor: '#6366F1' + '15' }]}>
                        <Text style={{ fontSize: 16 }}>🎯</Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Target Corpus</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>₹5,00,00,000</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => { haptics.light(); }}>
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                  </View>
                  

                  <View style={[styles.infoRow, { borderBottomColor: theme.colors.divider }]}>
                    <View style={styles.row}>
                      <View style={[styles.infoIcon, { backgroundColor: '#10B981' + '15' }]}>
                        <Text style={{ fontSize: 16 }}>💰</Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Monthly SIP Required</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>₹15,000</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => { haptics.light(); }}>
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                  </View>
                  

                  <View style={[styles.infoRow, { borderBottomColor: theme.colors.divider }]}>
                    <View style={styles.row}>
                      <View style={[styles.infoIcon, { backgroundColor: '#F59E0B' + '15' }]}>
                        <Text style={{ fontSize: 16 }}>📈</Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Expected Returns</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>12% p.a.</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => { haptics.light(); }}>
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                  </View>
                  

                  <View style={[styles.infoRow, { borderBottomColor: theme.colors.divider }]}>
                    <View style={styles.row}>
                      <View style={[styles.infoIcon, { backgroundColor: '#EC4899' + '15' }]}>
                        <Text style={{ fontSize: 16 }}>📅</Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Years to Retire</Text>
                        <Text style={[styles.infoValue, { color: theme.colors.text }]}>30 years</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => { haptics.light(); }}>
                      <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                  </View>
                  
                </GlassCard>
              </Animated.View>
              

              
              {/* Form Section */}
              <Animated.View entering={FadeInDown.duration(400).delay(200)}>
                <GlassCard style={{ marginHorizontal: 16, marginBottom: 16, padding: 16 }} animated={false}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>
                    📝 Enter Details
                  </Text>
                  
                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: theme.colors.textSecondary }]}>Current Age</Text>
                    
                    <TextInput
                      style={[styles.input, {
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                        backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary,
                      }]}
                      value={currentAge}
                      onChangeText={setCurrentAge}
                      placeholder="30"
                      placeholderTextColor={theme.colors.textTertiary}
                      keyboardType="number-pad"
                      
                    />
                    
                  </View>
                  

                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: theme.colors.textSecondary }]}>Retirement Age</Text>
                    
                    <TextInput
                      style={[styles.input, {
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                        backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary,
                      }]}
                      value={retireAge}
                      onChangeText={setRetireAge}
                      placeholder="60"
                      placeholderTextColor={theme.colors.textTertiary}
                      keyboardType="number-pad"
                      
                    />
                    
                  </View>
                  

                  <View style={styles.formGroup}>
                    <Text style={[styles.formLabel, { color: theme.colors.textSecondary }]}>Monthly Expense</Text>
                    
                    <TextInput
                      style={[styles.input, {
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                        backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary,
                      }]}
                      value={monthlyExpense}
                      onChangeText={setMonthlyExpense}
                      placeholder="₹50,000"
                      placeholderTextColor={theme.colors.textTertiary}
                      keyboardType="number-pad"
                      
                    />
                    
                  </View>
                  
                  
                </GlassCard>
              </Animated.View>
              

              

              
              {/* Action Buttons */}
              <Animated.View entering={FadeInDown.duration(400).delay(500)} style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                
                <GlassCard
                  onPress={() => { haptics.medium(); handleAction("Calculate"); }}
                  style={{ marginBottom: 10, padding: 14 }}
                >
                  <View style={styles.spaceBetween}>
                    <View style={styles.row}>
                      <View style={[styles.actionIcon, { backgroundColor: '#6366F1' + '15' }]}>
                        <Text style={{ fontSize: 20 }}>📊</Text>
                      </View>
                      <View style={{ marginLeft: 12 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.text }}>Calculate</Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}></Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
                  </View>
                </GlassCard>
                
              </Animated.View>
              
            </>
          )}

          {/* Bottom Spacing */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom CTA */}
      
      <Animated.View entering={FadeInUp.duration(300)} style={[styles.bottomBar, { backgroundColor: isDark ? theme.colors.surface : theme.colors.background, borderTopColor: theme.colors.border }]}>
        <AnimatedButton
          title="Calculate →"
          onPress={handleProcess}
          variant="gradient"
          size="large"
          fullWidth
          gradientColors={gradientPresets.primary}
        />
      </Animated.View>
      

      <FloatingAIButton />

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? theme.colors.surface : theme.colors.background }]}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: 16 }}>Confirm Action</Text>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 20 }}>
              Are you sure you want to proceed with this action? This may take a moment.
            </Text>
            <View style={styles.row}>
              <AnimatedButton title="Cancel" onPress={() => setShowModal(false)} variant="outline" size="medium" style={{ flex: 1, marginRight: 8 }} />
              <AnimatedButton title="Confirm" onPress={() => { setShowModal(false); handleProcess(); }} variant="primary" size="medium" style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  processingTitle: { fontSize: 22, fontWeight: '700', marginTop: 20, textAlign: 'center' },
  processingSubtitle: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  successCircle: { marginBottom: 20 },
  successGradient: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  successSubtitle: { fontSize: 15, marginTop: 8, textAlign: 'center' },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginRight: 8 },
  tabText: { fontSize: 14, fontWeight: '600' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontWeight: '500' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, marginTop: 2 },
  spaceBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  infoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 15, fontWeight: '600' },
  formGroup: { marginBottom: 16 },
  formLabel: { fontSize: 14, fontWeight: '500', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 4 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, borderWidth: 1, marginBottom: 4 },
  chipText: { fontSize: 13, fontWeight: '500' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, borderTopWidth: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 16 },
  modalContent: { borderRadius: 20, padding: 24 },
});
