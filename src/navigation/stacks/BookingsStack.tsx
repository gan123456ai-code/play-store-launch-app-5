
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AllBookingsScreen } from '../../screens/travel/bookings/AllBookingsScreen';
import { BookingDetailsScreen } from '../../screens/travel/bookings/BookingDetailsScreen';
import { BookingItineraryScreen } from '../../screens/travel/bookings/BookingItineraryScreen';
import { CancelBookingScreen } from '../../screens/travel/bookings/CancelBookingScreen';
import { ModifyBookingScreen } from '../../screens/travel/bookings/ModifyBookingScreen';
import { RefundStatusScreen } from '../../screens/travel/bookings/RefundStatusScreen';
import { BookingReceiptScreen } from '../../screens/travel/bookings/BookingReceiptScreen';
import { SupportChatScreen } from '../../screens/travel/bookings/SupportChatScreen';
import { TravelInsuranceScreen } from '../../screens/travel/bookings/TravelInsuranceScreen';
import { BookingHistoryScreen } from '../../screens/travel/bookings/BookingHistoryScreen';
import { UpcomingTripsScreen } from '../../screens/travel/bookings/UpcomingTripsScreen';
import { CompletedTripsScreen } from '../../screens/travel/bookings/CompletedTripsScreen';
import { CancelledBookingsScreen } from '../../screens/travel/bookings/CancelledBookingsScreen';

const Stack = createStackNavigator();

export const BookingsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AllBookings" component={AllBookingsScreen} />
    <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} />
    <Stack.Screen name="BookingItinerary" component={BookingItineraryScreen} />
    <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
    <Stack.Screen name="ModifyBooking" component={ModifyBookingScreen} />
    <Stack.Screen name="RefundStatus" component={RefundStatusScreen} />
    <Stack.Screen name="BookingReceipt" component={BookingReceiptScreen} />
    <Stack.Screen name="SupportChat" component={SupportChatScreen} />
    <Stack.Screen name="TravelInsurance" component={TravelInsuranceScreen} />
    <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
    <Stack.Screen name="UpcomingTrips" component={UpcomingTripsScreen} />
    <Stack.Screen name="CompletedTrips" component={CompletedTripsScreen} />
    <Stack.Screen name="CancelledBookings" component={CancelledBookingsScreen} />
  </Stack.Navigator>
);
