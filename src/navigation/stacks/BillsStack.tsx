
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { BillCategoriesScreen } from '../../screens/banking/bills/BillCategoriesScreen';
import { BillProvidersScreen } from '../../screens/banking/bills/BillProvidersScreen';
import { EnterBillAccountScreen } from '../../screens/banking/bills/EnterBillAccountScreen';
import { BillDetailsScreen } from '../../screens/banking/bills/BillDetailsScreen';
import { BillPaymentScreen } from '../../screens/banking/bills/BillPaymentScreen';
import { BillPaymentSuccessScreen } from '../../screens/banking/bills/BillPaymentSuccessScreen';
import { BillHistoryScreen } from '../../screens/banking/bills/BillHistoryScreen';
import { AutoPaySetupScreen } from '../../screens/banking/bills/AutoPaySetupScreen';
import { RechargeHomeScreen } from '../../screens/banking/bills/RechargeHomeScreen';
import { RechargePlansScreen } from '../../screens/banking/bills/RechargePlansScreen';
import { RechargeConfirmationScreen } from '../../screens/banking/bills/RechargeConfirmationScreen';
import { RechargeSuccessScreen } from '../../screens/banking/bills/RechargeSuccessScreen';
import { ManageAutoPayScreen } from '../../screens/banking/bills/ManageAutoPayScreen';
import { BillRemindersScreen } from '../../screens/banking/bills/BillRemindersScreen';
import { DTHRechargeScreen } from '../../screens/banking/bills/DTHRechargeScreen';
import { FASTagRechargeScreen } from '../../screens/banking/bills/FASTagRechargeScreen';

const Stack = createStackNavigator();

export const BillsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BillCategories" component={BillCategoriesScreen} />
    <Stack.Screen name="BillProviders" component={BillProvidersScreen} />
    <Stack.Screen name="EnterBillAccount" component={EnterBillAccountScreen} />
    <Stack.Screen name="BillDetails" component={BillDetailsScreen} />
    <Stack.Screen name="BillPayment" component={BillPaymentScreen} />
    <Stack.Screen name="BillPaymentSuccess" component={BillPaymentSuccessScreen} />
    <Stack.Screen name="BillHistory" component={BillHistoryScreen} />
    <Stack.Screen name="AutoPaySetup" component={AutoPaySetupScreen} />
    <Stack.Screen name="RechargeHome" component={RechargeHomeScreen} />
    <Stack.Screen name="RechargePlans" component={RechargePlansScreen} />
    <Stack.Screen name="RechargeConfirmation" component={RechargeConfirmationScreen} />
    <Stack.Screen name="RechargeSuccess" component={RechargeSuccessScreen} />
    <Stack.Screen name="ManageAutoPay" component={ManageAutoPayScreen} />
    <Stack.Screen name="BillReminders" component={BillRemindersScreen} />
    <Stack.Screen name="DTHRecharge" component={DTHRechargeScreen} />
    <Stack.Screen name="FASTagRecharge" component={FASTagRechargeScreen} />
  </Stack.Navigator>
);
