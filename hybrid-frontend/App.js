import React, { useEffect, useState, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import HomeScreen from './app/screens/HomeScreen';
import BeersScreen from './app/screens/BeersScreen';
import BeerDetailScreen from './app/screens/BeerDetailScreen';
import BarsScreen from './app/screens/BarsScreen';
import BarsEventsScreen from './app/screens/BarsEventsScreen';
import UsersScreen from './app/screens/UsersScreen';
import EventPhotoScreen from './app/screens/EventPhotoScreen';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const notificationListener = useRef();
  const responseListener = useRef();

  const checkLoginStatus = async () => {
    const token = await SecureStore.getItemAsync('authToken');
    console.log('Token:', token);
    setIsLoggedIn(!!token);
    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();

    // Register for push notifications
    registerForPushNotificationsAsync();

    // Handle notifications received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // You can handle foreground notifications here if needed
      console.log('Notification received in foreground:', notification);
    });

    // Handle notifications when the user interacts with them (e.g., taps on them)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data.event_picture_id) {
        // Navigate to the EventPhotoView screen to display the photo
        // Make sure to add EventPhotoView to your navigation stack
        navigationRef.current?.navigate('EventPhotoView', { eventPictureId: data.event_picture_id });
      }
    });

    return () => {
      // Clean up the notification listeners on unmount
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Reference for navigation
  const navigationRef = useRef();

  if (loading) {
    return null; // Or a loading component
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Beers"
          component={BeersScreen}
          options={{ title: 'Beers List' }}
        />
        <Stack.Screen
          name="BarsEvents"
          component={BarsEventsScreen}
          options={{ title: 'Bar Events List' }}
        />
        <Stack.Screen
          name="Bars"
          component={BarsScreen}
          options={{ title: 'Bars List' }}
        />
        <Stack.Screen name="Users" component={UsersScreen} />
        <Stack.Screen name="BeerDetail" component={BeerDetailScreen} />
        {/* Add EventPhotoView screen to handle photo viewing */}
        <Stack.Screen name="EventPhoto" component={EventPhotoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

// Helper function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    // Get existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permissions are not granted, request them
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permissions are still not granted, alert the user
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notifications!');
      return;
    }

    // Get the push token
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);

    // Save the device token to SecureStore
    await SecureStore.setItemAsync('deviceToken', token);

    // Send the device token to your backend
    const authToken = await SecureStore.getItemAsync('authToken');
    if (authToken) {
      try {
        await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/update_device_token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
          },
          body: JSON.stringify({ device_token: token }),
        });
      } catch (error) {
        console.error('Error sending device token to backend:', error);
      }
    }
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}
