import React, { createContext, useEffect, useRef, useState } from 'react';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children, channelName = 'FeedChannel' }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    const setupWebSocket = async () => {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        console.error('Authentication token not found');
        return;
      }

      const cleanToken = token.replace('Bearer ', ''); // Remove "Bearer " prefix
      const wsUrl = `wss://${EXPO_PUBLIC_API_BASE_URL.replace(/^https?:\/\//, '')}/cable?token=${cleanToken}`;
      console.log('WebSocket URL:', wsUrl);

      // Initialize WebSocket
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connection established.');
        setIsConnected(true);

        // Subscribe to the channel
        const subscriptionMessage = {
          command: 'subscribe',
          identifier: JSON.stringify({ channel: channelName }),
        };
        ws.current.send(JSON.stringify(subscriptionMessage));
      };

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (['ping', 'welcome', 'confirm_subscription'].includes(data.type)) {
          return; // Ignore system messages
        }

        if (data.message) {
          console.log('Message received:', data.message);
          setMessages((prev) => [...prev, data.message]);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error.message);
      };

      ws.current.onclose = (event) => {
        console.log(`WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
        setIsConnected(false);
      };
    };

    setupWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [channelName]); // Runs whenever channelName changes

  const sendMessage = (action, payload) => {
    if (ws.current && isConnected) {
      const message = {
        command: 'message',
        identifier: JSON.stringify({ channel: channelName }),
        data: JSON.stringify({ action, ...payload }),
      };
      ws.current.send(JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ messages, sendMessage, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
