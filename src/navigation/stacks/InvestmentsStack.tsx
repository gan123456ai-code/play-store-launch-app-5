
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { InvestmentsHomeScreen } from '../../screens/banking/investments/InvestmentsHomeScreen';
import { FDCalculatorScreen } from '../../screens/banking/investments/FDCalculatorScreen';
import { FDDetailsScreen } from '../../screens/banking/investments/FDDetailsScreen';
import { FDInvestScreen } from '../../screens/banking/investments/FDInvestScreen';
import { FDConfirmationScreen } from '../../screens/banking/investments/FDConfirmationScreen';
import { MutualFundsHomeScreen } from '../../screens/banking/investments/MutualFundsHomeScreen';
import { MutualFundDetailsScreen } from '../../screens/banking/investments/MutualFundDetailsScreen';
import { MutualFundInvestScreen } from '../../screens/banking/investments/MutualFundInvestScreen';
import { MutualFundConfirmationScreen } from '../../screens/banking/investments/MutualFundConfirmationScreen';
import { GoldInvestmentScreen } from '../../screens/banking/investments/GoldInvestmentScreen';
import { GoldBuyScreen } from '../../screens/banking/investments/GoldBuyScreen';
import { GoldConfirmationScreen } from '../../screens/banking/investments/GoldConfirmationScreen';
import { PortfolioScreen } from '../../screens/banking/investments/PortfolioScreen';
import { PortfolioDetailsScreen } from '../../screens/banking/investments/PortfolioDetailsScreen';
import { HistoricalReturnsScreen } from '../../screens/banking/investments/HistoricalReturnsScreen';
import { InvestmentStatementScreen } from '../../screens/banking/investments/InvestmentStatementScreen';
import { SIPManagerScreen } from '../../screens/banking/investments/SIPManagerScreen';
import { SIPDetailsScreen } from '../../screens/banking/investments/SIPDetailsScreen';
import { TaxSaverScreen } from '../../screens/banking/investments/TaxSaverScreen';
import { TaxSaverDetailsScreen } from '../../screens/banking/investments/TaxSaverDetailsScreen';

const Stack = createStackNavigator();

export const InvestmentsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="InvestmentsHome" component={InvestmentsHomeScreen} />
    <Stack.Screen name="FDCalculator" component={FDCalculatorScreen} />
    <Stack.Screen name="FDDetails" component={FDDetailsScreen} />
    <Stack.Screen name="FDInvest" component={FDInvestScreen} />
    <Stack.Screen name="FDConfirmation" component={FDConfirmationScreen} />
    <Stack.Screen name="MutualFundsHome" component={MutualFundsHomeScreen} />
    <Stack.Screen name="MutualFundDetails" component={MutualFundDetailsScreen} />
    <Stack.Screen name="MutualFundInvest" component={MutualFundInvestScreen} />
    <Stack.Screen name="MutualFundConfirmation" component={MutualFundConfirmationScreen} />
    <Stack.Screen name="GoldInvestment" component={GoldInvestmentScreen} />
    <Stack.Screen name="GoldBuy" component={GoldBuyScreen} />
    <Stack.Screen name="GoldConfirmation" component={GoldConfirmationScreen} />
    <Stack.Screen name="Portfolio" component={PortfolioScreen} />
    <Stack.Screen name="PortfolioDetails" component={PortfolioDetailsScreen} />
    <Stack.Screen name="HistoricalReturns" component={HistoricalReturnsScreen} />
    <Stack.Screen name="InvestmentStatement" component={InvestmentStatementScreen} />
    <Stack.Screen name="SIPManager" component={SIPManagerScreen} />
    <Stack.Screen name="SIPDetails" component={SIPDetailsScreen} />
    <Stack.Screen name="TaxSaver" component={TaxSaverScreen} />
    <Stack.Screen name="TaxSaverDetails" component={TaxSaverDetailsScreen} />
  </Stack.Navigator>
);
