
/**
 * AsyncStorage utility wrapper for TravelBank Ultra
 * Provides typed storage operations with error handling
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  THEME: '@travelbank_theme',
  APP_MODE: '@travelbank_mode',
  FAVORITES: '@travelbank_favorites',
  HISTORY: '@travelbank_history',
  PREFERENCES: '@travelbank_preferences',
  AI_MESSAGES: '@travelbank_ai_messages',
  BOOKINGS: '@travelbank_bookings',
  TRANSACTIONS: '@travelbank_transactions',
  CARDS: '@travelbank_cards',
  BILLS: '@travelbank_bills',
  INVESTMENTS: '@travelbank_investments',
  NOTIFICATIONS: '@travelbank_notifications',
  CONTACTS: '@travelbank_contacts',
  SEARCH_HISTORY: '@travelbank_search_history',
  RECENT_SEARCHES: '@travelbank_recent_searches',
  USER_PROFILE: '@travelbank_user_profile',
  SETTINGS: '@travelbank_settings',
  ONBOARDING: '@travelbank_onboarding',
  PASSCODE: '@travelbank_passcode',
  BIOMETRIC: '@travelbank_biometric',
  LANGUAGE: '@travelbank_language',
  CURRENCY: '@travelbank_currency',
  LAST_SYNC: '@travelbank_last_sync',
  CACHE_FLIGHTS: '@travelbank_cache_flights',
  CACHE_HOTELS: '@travelbank_cache_hotels',
  CACHE_TRAINS: '@travelbank_cache_trains',
  CACHE_ACCOUNTS: '@travelbank_cache_accounts',
  ANALYTICS_DATA: '@travelbank_analytics',
  BUDGET_DATA: '@travelbank_budget',
  GOALS_DATA: '@travelbank_goals',
  AUTO_PAY: '@travelbank_auto_pay',
  LINKED_ACCOUNTS: '@travelbank_linked_accounts',
  LOYALTY_POINTS: '@travelbank_loyalty',
  REWARDS: '@travelbank_rewards',
  SCHEDULED_TRANSFERS: '@travelbank_scheduled',
  SPLIT_BILLS: '@travelbank_split_bills',
  TAX_DATA: '@travelbank_tax',
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

export const storage = {
  async get<T>(key: StorageKey): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Storage get error for ${key}:`, error);
      return null;
    }
  },

  async set<T>(key: StorageKey, value: T): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Storage set error for ${key}:`, error);
      return false;
    }
  },

  async remove(key: StorageKey): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Storage remove error for ${key}:`, error);
      return false;
    }
  },

  async clear(): Promise<boolean> {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },

  async getMultiple<T>(keys: StorageKey[]): Promise<Map<StorageKey, T | null>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result = new Map<StorageKey, T | null>();
      pairs.forEach(([key, value]) => {
        result.set(key as StorageKey, value ? (JSON.parse(value) as T) : null);
      });
      return result;
    } catch (error) {
      console.error('Storage getMultiple error:', error);
      return new Map();
    }
  },

  async setMultiple<T>(entries: Array<[StorageKey, T]>): Promise<boolean> {
    try {
      const pairs: Array<[string, string]> = entries.map(([key, value]) => [key, JSON.stringify(value)]);
      await AsyncStorage.multiSet(pairs);
      return true;
    } catch (error) {
      console.error('Storage setMultiple error:', error);
      return false;
    }
  },

  async appendToArray<T>(key: StorageKey, item: T, maxLength: number = 100): Promise<boolean> {
    try {
      const existing = await this.get<T[]>(key);
      const arr = existing || [];
      arr.unshift(item);
      if (arr.length > maxLength) arr.pop();
      return this.set(key, arr);
    } catch (error) {
      console.error(`Storage appendToArray error for ${key}:`, error);
      return false;
    }
  },

  async removeFromArray<T extends { id: string }>(key: StorageKey, id: string): Promise<boolean> {
    try {
      const existing = await this.get<T[]>(key);
      if (!existing) return true;
      const filtered = existing.filter(item => item.id !== id);
      return this.set(key, filtered);
    } catch (error) {
      console.error(`Storage removeFromArray error for ${key}:`, error);
      return false;
    }
  },

  async updateInArray<T extends { id: string }>(key: StorageKey, id: string, updates: Partial<T>): Promise<boolean> {
    try {
      const existing = await this.get<T[]>(key);
      if (!existing) return false;
      const updated = existing.map(item => item.id === id ? { ...item, ...updates } : item);
      return this.set(key, updated);
    } catch (error) {
      console.error(`Storage updateInArray error for ${key}:`, error);
      return false;
    }
  },

  async getSize(): Promise<string> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) totalSize += value.length;
      }
      const kb = totalSize / 1024;
      if (kb < 1024) return `${kb.toFixed(1)} KB`;
      return `${(kb / 1024).toFixed(2)} MB`;
    } catch {
      return '0 KB';
    }
  },

  KEYS: STORAGE_KEYS,
};

export default storage;
