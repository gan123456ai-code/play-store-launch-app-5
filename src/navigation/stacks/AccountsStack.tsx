
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountsOverviewScreen } from '../../screens/banking/accounts/AccountsOverviewScreen';
import { TransactionDetailsScreen } from '../../screens/banking/accounts/TransactionDetailsScreen';
import { DisputeReportScreen } from '../../screens/banking/accounts/DisputeReportScreen';
import { BankSupportChatScreen } from '../../screens/banking/accounts/BankSupportChatScreen';
import { CardDetailsScreen } from '../../screens/banking/accounts/CardDetailsScreen';
import { CardSettingsScreen } from '../../screens/banking/accounts/CardSettingsScreen';
import { AccountStatementScreen } from '../../screens/banking/accounts/AccountStatementScreen';
import { SpendingAnalyticsScreen } from '../../screens/banking/accounts/SpendingAnalyticsScreen';
import { BeneficiaryListScreen } from '../../screens/banking/accounts/BeneficiaryListScreen';
import { AddBeneficiaryScreen } from '../../screens/banking/accounts/AddBeneficiaryScreen';
import { NotificationCenterScreen } from '../../screens/banking/accounts/NotificationCenterScreen';
import { ProfileSettingsScreen } from '../../screens/banking/accounts/ProfileSettingsScreen';
import { SecuritySettingsScreen } from '../../screens/banking/accounts/SecuritySettingsScreen';
import { LinkedAccountsScreen } from '../../screens/banking/accounts/LinkedAccountsScreen';
import { RewardsCenterScreen } from '../../screens/banking/accounts/RewardsCenterScreen';
import { CardBlockScreen } from '../../screens/banking/accounts/CardBlockScreen';
import { PinChangeScreen } from '../../screens/banking/accounts/PinChangeScreen';
import { LimitSettingsScreen } from '../../screens/banking/accounts/LimitSettingsScreen';

const Stack = createStackNavigator();

export const AccountsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AccountsOverview" component={AccountsOverviewScreen} />
    <Stack.Screen name="TransactionDetails" component={TransactionDetailsScreen} />
    <Stack.Screen name="DisputeReport" component={DisputeReportScreen} />
    <Stack.Screen name="BankSupportChat" component={BankSupportChatScreen} />
    <Stack.Screen name="CardDetails" component={CardDetailsScreen} />
    <Stack.Screen name="CardSettings" component={CardSettingsScreen} />
    <Stack.Screen name="AccountStatement" component={AccountStatementScreen} />
    <Stack.Screen name="SpendingAnalytics" component={SpendingAnalyticsScreen} />
    <Stack.Screen name="BeneficiaryList" component={BeneficiaryListScreen} />
    <Stack.Screen name="AddBeneficiary" component={AddBeneficiaryScreen} />
    <Stack.Screen name="NotificationCenter" component={NotificationCenterScreen} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
    <Stack.Screen name="LinkedAccounts" component={LinkedAccountsScreen} />
    <Stack.Screen name="RewardsCenter" component={RewardsCenterScreen} />
    <Stack.Screen name="CardBlock" component={CardBlockScreen} />
    <Stack.Screen name="PinChange" component={PinChangeScreen} />
    <Stack.Screen name="LimitSettings" component={LimitSettingsScreen} />
  </Stack.Navigator>
);
