
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HotelSearchScreen } from '../../screens/travel/hotels/HotelSearchScreen';
import { HotelResultsScreen } from '../../screens/travel/hotels/HotelResultsScreen';
import { HotelDetailsScreen } from '../../screens/travel/hotels/HotelDetailsScreen';
import { RoomSelectionScreen } from '../../screens/travel/hotels/RoomSelectionScreen';
import { HotelReviewsScreen } from '../../screens/travel/hotels/HotelReviewsScreen';
import { HotelBookingFormScreen } from '../../screens/travel/hotels/HotelBookingFormScreen';
import { HotelPaymentScreen } from '../../screens/travel/hotels/HotelPaymentScreen';
import { HotelConfirmationScreen } from '../../screens/travel/hotels/HotelConfirmationScreen';
import { HotelAmenitiesScreen } from '../../screens/travel/hotels/HotelAmenitiesScreen';
import { NearbyAttractionsScreen } from '../../screens/travel/hotels/NearbyAttractionsScreen';
import { HotelPoliciesScreen } from '../../screens/travel/hotels/HotelPoliciesScreen';
import { HotelGalleryScreen } from '../../screens/travel/hotels/HotelGalleryScreen';
import { HotelCompareScreen } from '../../screens/travel/hotels/HotelCompareScreen';
import { HotelMapScreen } from '../../screens/travel/hotels/HotelMapScreen';

const Stack = createStackNavigator();

export const HotelsStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HotelSearch" component={HotelSearchScreen} />
    <Stack.Screen name="HotelResults" component={HotelResultsScreen} />
    <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
    <Stack.Screen name="RoomSelection" component={RoomSelectionScreen} />
    <Stack.Screen name="HotelReviews" component={HotelReviewsScreen} />
    <Stack.Screen name="HotelBookingForm" component={HotelBookingFormScreen} />
    <Stack.Screen name="HotelPayment" component={HotelPaymentScreen} />
    <Stack.Screen name="HotelConfirmation" component={HotelConfirmationScreen} />
    <Stack.Screen name="HotelAmenities" component={HotelAmenitiesScreen} />
    <Stack.Screen name="NearbyAttractions" component={NearbyAttractionsScreen} />
    <Stack.Screen name="HotelPolicies" component={HotelPoliciesScreen} />
    <Stack.Screen name="HotelGallery" component={HotelGalleryScreen} />
    <Stack.Screen name="HotelCompare" component={HotelCompareScreen} />
    <Stack.Screen name="HotelMap" component={HotelMapScreen} />
  </Stack.Navigator>
);
