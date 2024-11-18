import { createConsumer } from '@rails/actioncable';
import * as SecureStore from 'expo-secure-store';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import { WebSocket } from 'react-native'; // Import React Native's WebSocket

// Monkey-patch ActionCable's WebSocket to use React Native's WebSocket
if (typeof global.WebSocket !== 'function') {
  global.WebSocket = WebSocket;
}

let cable = null;

export const createCable = async () => {
  if (cable) {
    console.log('Returning existing ActionCable consumer');
    return cable;
  }

  const token = await SecureStore.getItemAsync('authToken');
  if (!token) {
    throw new Error('Authentication token not found');
  }

  const cleanToken = token.replace('Bearer ', '');
  const websocketUrl = `${EXPO_PUBLIC_API_BASE_URL.replace(/^http/, 'ws')}/cable?token=${cleanToken}`;
  console.log('WebSocket URL:', websocketUrl);

  try {
    cable = createConsumer(websocketUrl);
    console.log('ActionCable consumer created:', cable);
    return cable;
  } catch (error) {
    console.error('Error creating ActionCable consumer:', error);
    throw error;
  }
};

export const getCable = () => {
  if (!cable) {
    throw new Error('Cable not initialized. Call createCable first.');
  }
  return cable;
};
