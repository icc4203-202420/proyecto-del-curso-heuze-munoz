import React, { createContext, useEffect, useRef, useState } from 'react';
import { EXPO_PUBLIC_API_BASE_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [feed, setFeed] = useState([]);
  const [filters, setFilters] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    const setupWebSocket = async () => {
      // Retrieve the authentication token
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        console.error('Authentication token not found');
        return;
      }

      const cleanToken = token.replace('Bearer ', '');
      const wsUrl = `wss://${EXPO_PUBLIC_API_BASE_URL.replace(/^https?:\/\//, '')}/cable?token=${cleanToken}`;

      // Initialize WebSocket connection
      ws.current = new WebSocket(wsUrl);

      // Handle WebSocket open event
      ws.current.onopen = () => {
        console.log('WebSocket connection established.');
        setIsConnected(true);

        // Subscribe to the FeedChannel
        const subscriptionMessage = {
          command: 'subscribe',
          identifier: JSON.stringify({ channel: 'FeedChannel' }),
        };
        ws.current.send(JSON.stringify(subscriptionMessage));
      };

      // Handle incoming WebSocket messages
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (['ping', 'welcome', 'confirm_subscription'].includes(data.type)) {
          return; // Ignore system messages
        }

        if (data.message) {
          console.log('Message received:', data.message);
          const newMessage = data.message;

          // Apply filters if any
          if (!filters || filterMessage(newMessage)) {
            setFeed((prev) => [newMessage, ...prev]);
          }
        }
      };

      // Handle WebSocket errors
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error.message);
      };

      // Handle WebSocket close event
      ws.current.onclose = (event) => {
        console.log(`WebSocket closed: Code ${event.code}, Reason: ${event.reason}`);
        setIsConnected(false);
      };

      // Fetch initial feed data from the API
      fetchInitialFeed(token);
    };

    setupWebSocket();

    // Clean up WebSocket connection on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [filters]); // Re-run effect if filters change

  // Function to fetch initial feed data
  const fetchInitialFeed = async (token) => {
    try {
      const response = await fetch(`${EXPO_PUBLIC_API_BASE_URL}/api/v1/feeds`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });
      if (!response.ok) {
        console.error(`Error fetching feed: ${response.status} ${response.statusText}`);
        return;
      }
      const data = await response.json();
      setFeed(data.feed);
    } catch (error) {
      console.error('Error fetching initial feed:', error);
    }
  };

  const filterMessage = (message) => {
    switch (message.type) {
      case 'review':
        if (!filters) return true;
        switch (filters.type) {
          case 'friend':
            return message.review.user.id === parseInt(filters.value, 10);
          case 'beer':
            return message.review.beer.id === parseInt(filters.value, 10);
          default:
            return true;
        }
      case 'event_picture':
        if (!filters) return true;
        // Define filters for event_picture if needed
        if (filters.type === 'friend') {
          return message.event_picture.user.id === parseInt(filters.value, 10);
        }
        // Add more cases as needed
        return true;
      default:
        return false;
    }
  };

  return (
    <WebSocketContext.Provider value={{ feed, setFilters, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
