
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useHaptics } from '../../hooks/useHaptics';
import { BottomSheetAction } from '../../types';

interface QuickActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  actions: BottomSheetAction[];
}

export const QuickActionSheet: React.FC<QuickActionSheetProps> = ({
  visible,
  onClose,
  title,
  actions,
}) => {
  const { theme, isDark } = useTheme();
  const haptics = useHaptics();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%', '60%'], []);

  React.useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onClose={onClose}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: isDark ? theme.colors.surface : theme.colors.background }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.textTertiary }}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionItem, { borderBottomColor: theme.colors.divider }]}
            onPress={() => {
              haptics.light();
              action.onPress();
              onClose();
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIcon, { backgroundColor: (action.color || theme.colors.primary) + '15' }]}>
              <Text style={{ fontSize: 20 }}>{action.icon}</Text>
            </View>
            <View style={styles.actionText}>
              <Text style={[styles.actionLabel, { color: action.destructive ? theme.colors.error : theme.colors.text }]}>
                {action.label}
              </Text>
              {action.subtitle && (
                <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>
                  {action.subtitle}
                </Text>
              )}
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  actionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  actionText: { flex: 1 },
  actionLabel: { fontSize: 16, fontWeight: '500' },
  actionSubtitle: { fontSize: 13, marginTop: 2 },
});
