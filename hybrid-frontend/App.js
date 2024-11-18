import React, { useEffect, useState, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import HomeScreen from './app/screens/HomeScreen';
import FeedScreen from './app/screens/FeedScreen';
import BeersScreen from './app/screens/BeersScreen';
import BeerDetailScreen from './app/screens/BeerDetailScreen';
import BarsScreen from './app/screens/BarsScreen';
import BarsEventsScreen from './app/screens/BarsEventsScreen';
import UsersScreen from './app/screens/UsersScreen';
import EventPhotoScreen from './app/screens/EventPhotoScreen';
import EventSummaryScreen from './app/screens/EventSummaryScreen';
import { WebSocketProvider } from './app/utility/WebSocketProvider';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import { navigationRef, navigate } from './app/utility/RootNavigation';

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
      if (data.event_picture_id && data.event_id) {
        // You can extract the uploader's information
        const uploader = data.uploader; // { id: uploaderId, handle: uploaderHandle }
    
        // Navigate to EventPhotoView and pass uploader's info if needed
        navigate('EventPhotoView', {
          eventId: data.event_id,
          eventPictureId: data.event_picture_id,
          uploader // Pass the uploader data
        });
      }
    });

    return () => {
      // Clean up the notification listeners on unmount
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (loading) {
    return null; // Or a loading component
  }

  return (
    <WebSocketProvider>
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
          <Stack.Screen name="EventPhoto" component={EventPhotoScreen} />
          <Stack.Screen name="EventPhotoView" component={EventPhotoScreen} />
          <Stack.Screen name="EventSummary" component={EventSummaryScreen} options={{ title: 'Event Summary' }} />
          <Stack.Screen name="Feed" component={FeedScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </WebSocketProvider>
  );
};

export default App;

// Helper function to register for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notifications!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo push token:', token);

    await SecureStore.setItemAsync('deviceToken', token);

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
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }
}
