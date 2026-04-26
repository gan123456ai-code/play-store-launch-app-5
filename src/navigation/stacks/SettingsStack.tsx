
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsHomeScreen } from '../../screens/settings/SettingsHomeScreen';
import { ProfileEditScreen } from '../../screens/settings/ProfileEditScreen';
import { NotificationSettingsScreen } from '../../screens/settings/NotificationSettingsScreen';
import { PrivacySettingsScreen } from '../../screens/settings/PrivacySettingsScreen';
import { BankSecuritySettingsScreen } from '../../screens/settings/BankSecuritySettingsScreen';
import { AppearanceSettingsScreen } from '../../screens/settings/AppearanceSettingsScreen';
import { LanguageSettingsScreen } from '../../screens/settings/LanguageSettingsScreen';
import { CurrencySettingsScreen } from '../../screens/settings/CurrencySettingsScreen';
import { HelpCenterScreen } from '../../screens/settings/HelpCenterScreen';
import { AboutAppScreen } from '../../screens/settings/AboutAppScreen';
import { FeedbackFormScreen } from '../../screens/settings/FeedbackFormScreen';
import { TermsOfServiceScreen } from '../../screens/settings/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from '../../screens/settings/PrivacyPolicyScreen';
import { DataExportScreen } from '../../screens/settings/DataExportScreen';
import { DeleteAccountScreen } from '../../screens/settings/DeleteAccountScreen';

const Stack = createStackNavigator();

export const SettingsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingsHome" component={SettingsHomeScreen} />
    <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
    <Stack.Screen name="SecuritySettings" component={BankSecuritySettingsScreen} />
    <Stack.Screen name="AppearanceSettings" component={AppearanceSettingsScreen} />
    <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
    <Stack.Screen name="CurrencySettings" component={CurrencySettingsScreen} />
    <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
    <Stack.Screen name="AboutApp" component={AboutAppScreen} />
    <Stack.Screen name="Feedback" component={FeedbackFormScreen} />
    <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    <Stack.Screen name="DataExport" component={DataExportScreen} />
    <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
  </Stack.Navigator>
);
