
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TrainSearchScreen } from '../../screens/travel/trains/TrainSearchScreen';
import { TrainResultsScreen } from '../../screens/travel/trains/TrainResultsScreen';
import { TrainSeatSelectionScreen } from '../../screens/travel/trains/TrainSeatSelectionScreen';
import { TrainPassengerDetailsScreen } from '../../screens/travel/trains/TrainPassengerDetailsScreen';
import { TrainFoodSelectionScreen } from '../../screens/travel/trains/TrainFoodSelectionScreen';
import { TrainPaymentScreen } from '../../screens/travel/trains/TrainPaymentScreen';
import { TrainConfirmationScreen } from '../../screens/travel/trains/TrainConfirmationScreen';
import { TrainTrackingScreen } from '../../screens/travel/trains/TrainTrackingScreen';
import { TrainScheduleScreen } from '../../screens/travel/trains/TrainScheduleScreen';
import { PlatformInfoScreen } from '../../screens/travel/trains/PlatformInfoScreen';
import { TrainReviewsScreen } from '../../screens/travel/trains/TrainReviewsScreen';
import { CoachLayoutScreen } from '../../screens/travel/trains/CoachLayoutScreen';
import { StationFacilitiesScreen } from '../../screens/travel/trains/StationFacilitiesScreen';
import { BusSearchScreen } from '../../screens/travel/trains/BusSearchScreen';
import { BusResultsScreen } from '../../screens/travel/trains/BusResultsScreen';
import { BusDetailsScreen } from '../../screens/travel/trains/BusDetailsScreen';
import { BusSeatSelectionScreen } from '../../screens/travel/trains/BusSeatSelectionScreen';
import { BusBookingFormScreen } from '../../screens/travel/trains/BusBookingFormScreen';
import { BusPaymentScreen } from '../../screens/travel/trains/BusPaymentScreen';
import { BusConfirmationScreen } from '../../screens/travel/trains/BusConfirmationScreen';

const Stack = createStackNavigator();

export const TrainsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TrainSearch" component={TrainSearchScreen} />
    <Stack.Screen name="TrainResults" component={TrainResultsScreen} />
    <Stack.Screen name="TrainSeatSelection" component={TrainSeatSelectionScreen} />
    <Stack.Screen name="TrainPassengerDetails" component={TrainPassengerDetailsScreen} />
    <Stack.Screen name="TrainFoodSelection" component={TrainFoodSelectionScreen} />
    <Stack.Screen name="TrainPayment" component={TrainPaymentScreen} />
    <Stack.Screen name="TrainConfirmation" component={TrainConfirmationScreen} />
    <Stack.Screen name="TrainTracking" component={TrainTrackingScreen} />
    <Stack.Screen name="TrainSchedule" component={TrainScheduleScreen} />
    <Stack.Screen name="PlatformInfo" component={PlatformInfoScreen} />
    <Stack.Screen name="TrainReviews" component={TrainReviewsScreen} />
    <Stack.Screen name="CoachLayout" component={CoachLayoutScreen} />
    <Stack.Screen name="StationFacilities" component={StationFacilitiesScreen} />
    <Stack.Screen name="BusSearch" component={BusSearchScreen} />
    <Stack.Screen name="BusResults" component={BusResultsScreen} />
    <Stack.Screen name="BusDetails" component={BusDetailsScreen} />
    <Stack.Screen name="BusSeatSelection" component={BusSeatSelectionScreen} />
    <Stack.Screen name="BusBookingForm" component={BusBookingFormScreen} />
    <Stack.Screen name="BusPayment" component={BusPaymentScreen} />
    <Stack.Screen name="BusConfirmation" component={BusConfirmationScreen} />
  </Stack.Navigator>
);
