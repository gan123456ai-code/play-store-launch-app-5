
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { FlightSearchScreen } from '../../screens/travel/flights/FlightSearchScreen';
import { FlightResultsScreen } from '../../screens/travel/flights/FlightResultsScreen';
import { FlightDetailsScreen } from '../../screens/travel/flights/FlightDetailsScreen';
import { SeatSelectionScreen } from '../../screens/travel/flights/SeatSelectionScreen';
import { PassengerDetailsScreen } from '../../screens/travel/flights/PassengerDetailsScreen';
import { FlightPaymentScreen } from '../../screens/travel/flights/FlightPaymentScreen';
import { FlightConfirmationScreen } from '../../screens/travel/flights/FlightConfirmationScreen';
import { AirlineInfoScreen } from '../../screens/travel/flights/AirlineInfoScreen';
import { FlightCompareScreen } from '../../screens/travel/flights/FlightCompareScreen';
import { FlightAlertsScreen } from '../../screens/travel/flights/FlightAlertsScreen';
import { FlightReviewsScreen } from '../../screens/travel/flights/FlightReviewsScreen';
import { BaggageInfoScreen } from '../../screens/travel/flights/BaggageInfoScreen';
import { MealSelectionScreen } from '../../screens/travel/flights/MealSelectionScreen';
import { InsuranceOptionsScreen } from '../../screens/travel/flights/InsuranceOptionsScreen';
import { LoungeAccessScreen } from '../../screens/travel/flights/LoungeAccessScreen';

const Stack = createStackNavigator();

export const FlightsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FlightSearch" component={FlightSearchScreen} />
    <Stack.Screen name="FlightResults" component={FlightResultsScreen} />
    <Stack.Screen name="FlightDetails" component={FlightDetailsScreen} />
    <Stack.Screen name="SeatSelection" component={SeatSelectionScreen} />
    <Stack.Screen name="PassengerDetails" component={PassengerDetailsScreen} />
    <Stack.Screen name="FlightPayment" component={FlightPaymentScreen} />
    <Stack.Screen name="FlightConfirmation" component={FlightConfirmationScreen} />
    <Stack.Screen name="AirlineInfo" component={AirlineInfoScreen} />
    <Stack.Screen name="FlightCompare" component={FlightCompareScreen} />
    <Stack.Screen name="FlightAlerts" component={FlightAlertsScreen} />
    <Stack.Screen name="FlightReviews" component={FlightReviewsScreen} />
    <Stack.Screen name="BaggageInfo" component={BaggageInfoScreen} />
    <Stack.Screen name="MealSelection" component={MealSelectionScreen} />
    <Stack.Screen name="InsuranceOptions" component={InsuranceOptionsScreen} />
    <Stack.Screen name="LoungAccess" component={LoungeAccessScreen} />
  </Stack.Navigator>
);
