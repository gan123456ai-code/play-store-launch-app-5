
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SendMoneyHomeScreen } from '../../screens/banking/sendMoney/SendMoneyHomeScreen';
import { ContactsListScreen } from '../../screens/banking/sendMoney/ContactsListScreen';
import { EnterAmountScreen } from '../../screens/banking/sendMoney/EnterAmountScreen';
import { TransferConfirmationScreen } from '../../screens/banking/sendMoney/TransferConfirmationScreen';
import { EnterPinScreen } from '../../screens/banking/sendMoney/EnterPinScreen';
import { TransferSuccessScreen } from '../../screens/banking/sendMoney/TransferSuccessScreen';
import { TransferReceiptScreen } from '../../screens/banking/sendMoney/TransferReceiptScreen';
import { ScanQRScreen } from '../../screens/banking/sendMoney/ScanQRScreen';
import { RequestMoneyScreen } from '../../screens/banking/sendMoney/RequestMoneyScreen';
import { TransferHistoryScreen } from '../../screens/banking/sendMoney/TransferHistoryScreen';
import { ScheduledTransfersScreen } from '../../screens/banking/sendMoney/ScheduledTransfersScreen';
import { CreateScheduledTransferScreen } from '../../screens/banking/sendMoney/CreateScheduledTransferScreen';
import { SplitBillScreen } from '../../screens/banking/sendMoney/SplitBillScreen';
import { SplitBillDetailsScreen } from '../../screens/banking/sendMoney/SplitBillDetailsScreen';
import { InternationalTransferScreen } from '../../screens/banking/sendMoney/InternationalTransferScreen';

const Stack = createStackNavigator();

export const SendMoneyStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SendMoneyHome" component={SendMoneyHomeScreen} />
    <Stack.Screen name="ContactsList" component={ContactsListScreen} />
    <Stack.Screen name="EnterAmount" component={EnterAmountScreen} />
    <Stack.Screen name="TransferConfirmation" component={TransferConfirmationScreen} />
    <Stack.Screen name="EnterPin" component={EnterPinScreen} />
    <Stack.Screen name="TransferSuccess" component={TransferSuccessScreen} />
    <Stack.Screen name="TransferReceipt" component={TransferReceiptScreen} />
    <Stack.Screen name="ScanQR" component={ScanQRScreen} />
    <Stack.Screen name="RequestMoney" component={RequestMoneyScreen} />
    <Stack.Screen name="TransferHistory" component={TransferHistoryScreen} />
    <Stack.Screen name="ScheduledTransfers" component={ScheduledTransfersScreen} />
    <Stack.Screen name="CreateScheduledTransfer" component={CreateScheduledTransferScreen} />
    <Stack.Screen name="SplitBill" component={SplitBillScreen} />
    <Stack.Screen name="SplitBillDetails" component={SplitBillDetailsScreen} />
    <Stack.Screen name="InternationalTransfer" component={InternationalTransferScreen} />
  </Stack.Navigator>
);
