import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for notifications!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    // Save token to SecureStore
    await SecureStore.setItemAsync('deviceToken', token);

    // Send token to backend
    const authToken = await SecureStore.getItemAsync('authToken');
    if (authToken) {
      await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/users/update_device_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({ device_token: token }),
      });
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
