
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppMode, UserPreferences, Booking, AIMessage } from '../types';

interface AppContextType {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  toggleAppMode: () => void;
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  searchHistory: string[];
  addToHistory: (term: string) => void;
  clearHistory: () => void;
  bookings: Booking[];
  aiMessages: AIMessage[];
  addAIMessage: (msg: AIMessage) => void;
  isAIOpen: boolean;
  setIsAIOpen: (open: boolean) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const defaultPrefs: UserPreferences = {
  theme: 'dark',
  appMode: 'travel',
  hapticEnabled: true,
  notificationsEnabled: true,
  biometricEnabled: false,
  currency: 'INR',
  language: 'en',
  recentSearches: [],
  favoriteFlights: [],
  favoriteHotels: [],
  savedPayees: [],
};

const AppContext = createContext<AppContextType>({
  appMode: 'travel',
  setAppMode: () => {},
  toggleAppMode: () => {},
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  searchHistory: [],
  addToHistory: () => {},
  clearHistory: () => {},
  bookings: [],
  aiMessages: [],
  addAIMessage: () => {},
  isAIOpen: false,
  setIsAIOpen: () => {},
  preferences: defaultPrefs,
  updatePreferences: () => {},
});

export const useApp = () => useContext(AppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appMode, setAppModeState] = useState<AppMode>('travel');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [bookings] = useState<Booking[]>([]);
  const [aiMessages, setAIMessages] = useState<AIMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your TravelBank AI assistant. How can I help you today? 🌍✈️',
      timestamp: new Date(),
    },
  ]);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPrefs);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [savedMode, savedFavs, savedHistory, savedPrefs] = await Promise.all([
        AsyncStorage.getItem('@app_mode'),
        AsyncStorage.getItem('@favorites'),
        AsyncStorage.getItem('@search_history'),
        AsyncStorage.getItem('@preferences'),
      ]);
      if (savedMode === 'travel' || savedMode === 'banking') setAppModeState(savedMode);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
      if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
    } catch (e) {
      // Use defaults
    }
  };

  const setAppMode = useCallback(async (mode: AppMode) => {
    setAppModeState(mode);
    try { await AsyncStorage.setItem('@app_mode', mode); } catch (e) {}
  }, []);

  const toggleAppMode = useCallback(() => {
    const newMode = appMode === 'travel' ? 'banking' : 'travel';
    setAppMode(newMode);
  }, [appMode, setAppMode]);

  const addFavorite = useCallback(async (id: string) => {
    const updated = [...favorites, id];
    setFavorites(updated);
    try { await AsyncStorage.setItem('@favorites', JSON.stringify(updated)); } catch (e) {}
  }, [favorites]);

  const removeFavorite = useCallback(async (id: string) => {
    const updated = favorites.filter(f => f !== id);
    setFavorites(updated);
    try { await AsyncStorage.setItem('@favorites', JSON.stringify(updated)); } catch (e) {}
  }, [favorites]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const addToHistory = useCallback(async (term: string) => {
    const updated = [term, ...searchHistory.filter(h => h !== term)].slice(0, 20);
    setSearchHistory(updated);
    try { await AsyncStorage.setItem('@search_history', JSON.stringify(updated)); } catch (e) {}
  }, [searchHistory]);

  const clearHistory = useCallback(async () => {
    setSearchHistory([]);
    try { await AsyncStorage.removeItem('@search_history'); } catch (e) {}
  }, []);

  const addAIMessage = useCallback((msg: AIMessage) => {
    setAIMessages(prev => [...prev, msg]);
  }, []);

  const updatePreferences = useCallback(async (prefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...prefs };
    setPreferences(updated);
    try { await AsyncStorage.setItem('@preferences', JSON.stringify(updated)); } catch (e) {}
  }, [preferences]);

  return (
    <AppContext.Provider value={{
      appMode, setAppMode, toggleAppMode,
      favorites, addFavorite, removeFavorite, isFavorite,
      searchHistory, addToHistory, clearHistory,
      bookings, aiMessages, addAIMessage,
      isAIOpen, setIsAIOpen,
      preferences, updatePreferences,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
