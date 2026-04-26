
import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useApp } from '../context/AppContext';

export const useHaptics = () => {
  const { preferences } = useApp();

  const light = useCallback(() => {
    if (preferences.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [preferences.hapticEnabled]);

  const medium = useCallback(() => {
    if (preferences.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [preferences.hapticEnabled]);

  const heavy = useCallback(() => {
    if (preferences.hapticEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }, [preferences.hapticEnabled]);

  const success = useCallback(() => {
    if (preferences.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [preferences.hapticEnabled]);

  const warning = useCallback(() => {
    if (preferences.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [preferences.hapticEnabled]);

  const error = useCallback(() => {
    if (preferences.hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [preferences.hapticEnabled]);

  const selection = useCallback(() => {
    if (preferences.hapticEnabled) {
      Haptics.selectionAsync();
    }
  }, [preferences.hapticEnabled]);

  return { light, medium, heavy, success, warning, error, selection };
};
