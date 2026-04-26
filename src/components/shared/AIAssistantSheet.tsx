
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform,
} from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useHaptics } from '../../hooks/useHaptics';
import { AIMessage } from '../../types';

const aiResponses = [
  "I'd recommend checking flights to Goa - great deals available this month! 🏖️",
  "Based on your travel history, I suggest the Taj Mahal Palace in Mumbai. Excellent reviews! ⭐",
  "Your account balance is healthy. Would you like me to suggest some investment options? 📈",
  "I found 3 trains available for your route tomorrow. Shall I show the options? 🚂",
  "Great news! There's a 20% discount on hotel bookings in Jaipur this weekend. 🏰",
  "Your SIP investments are performing well - 22% returns this year! Keep it up! 💪",
  "I can help you split the bill among your friends. Just share the details! 🍕",
  "Tip: Pay your electricity bill before the due date to avoid late charges. ⚡",
  "I notice you travel to Delhi frequently. Want me to set up flight alerts? ✈️",
  "Your FD is maturing next month. Shall I explore reinvestment options? 🏦",
];

export const AIAssistantSheet: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { aiMessages, addAIMessage, isAIOpen, setIsAIOpen } = useApp();
  const haptics = useHaptics();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [inputText, setInputText] = useState('');
  const snapPoints = useMemo(() => ['50%', '85%'], []);

  React.useEffect(() => {
    if (isAIOpen) {
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isAIOpen]);

  const handleClose = useCallback(() => {
    setIsAIOpen(false);
  }, []);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    haptics.light();
    
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };
    addAIMessage(userMsg);
    setInputText('');

    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      addAIMessage(aiMsg);
      haptics.success();
    }, 1000 + Math.random() * 1500);
  }, [inputText]);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    []
  );

  const renderMessage = ({ item }: { item: AIMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble, {
        backgroundColor: isUser ? theme.colors.primary : isDark ? theme.colors.surfaceElevated : theme.colors.backgroundSecondary,
      }]}>
        {!isUser && <Text style={styles.aiAvatar}>🤖</Text>}
        <Text style={[styles.messageText, { color: isUser ? '#FFFFFF' : theme.colors.text }]}>
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onClose={handleClose}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: isDark ? theme.colors.surface : theme.colors.background }}
      handleIndicatorStyle={{ backgroundColor: theme.colors.textTertiary }}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={[theme.colors.gradient1Start, theme.colors.gradient1End]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerIcon}>🤖</Text>
          <View>
            <Text style={styles.headerTitle}>TravelBank AI</Text>
            <Text style={styles.headerSubtitle}>Your personal assistant</Text>
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={aiMessages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        inverted={false}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.inputContainer, {
          backgroundColor: isDark ? theme.colors.backgroundSecondary : theme.colors.surface,
          borderTopColor: theme.colors.border,
        }]}>
          <TextInput
            style={[styles.input, {
              backgroundColor: isDark ? theme.colors.backgroundTertiary : theme.colors.backgroundSecondary,
              color: theme.colors.text,
            }]}
            placeholder="Ask me anything..."
            placeholderTextColor={theme.colors.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <LinearGradient
              colors={[theme.colors.gradient1Start, theme.colors.gradient1End]}
              style={styles.sendGradient}
            >
              <Text style={styles.sendIcon}>↑</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, marginBottom: 8 },
  headerGradient: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16 },
  headerIcon: { fontSize: 32, marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  messageList: { padding: 16 },
  messageBubble: { padding: 12, borderRadius: 16, marginBottom: 8, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 4, flexDirection: 'row', alignItems: 'flex-start' },
  aiAvatar: { fontSize: 16, marginRight: 8 },
  messageText: { fontSize: 15, lineHeight: 22 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 1 },
  input: { flex: 1, height: 44, borderRadius: 22, paddingHorizontal: 16, fontSize: 15 },
  sendButton: { marginLeft: 8 },
  sendGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
});
