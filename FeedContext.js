import React, { createContext, useState, useEffect } from 'react';
import { createCable, getCable } from './ActionCable';

export const FeedContext = createContext();

export const FeedProvider = ({ children }) => {
  const [feed, setFeed] = useState([]);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    const setupSubscription = async () => {
      try {
        console.log('Initializing ActionCable subscription...');
        await createCable();
        const cable = getCable();
        console.log('ActionCable consumer created:', cable);

        // Create the subscription
        const sub = cable.subscriptions.create(
          { channel: 'FeedChannel' },
          {
            connected: () => {
              console.log('Connected to FeedChannel');
            },
            disconnected: () => {
              console.log('Disconnected from FeedChannel');
            },
            received: (data) => {
              console.log('Data received from FeedChannel:', data);
              setFeed((prevFeed) => [data, ...prevFeed]);
            },
            rejected: () => {
              console.error('Subscription to FeedChannel rejected');
            },
          }
        );

        console.log('Subscription object created:', sub);
        setSubscription(sub); // Save the subscription
      } catch (error) {
        console.error('Error setting up ActionCable:', error);
      }
    };

    setupSubscription();

    return () => {
      console.log('Cleaning up subscription...');
      if (subscription) {
        subscription.unsubscribe();
        console.log('Unsubscribed from FeedChannel');
      } else {
        console.log('No subscription to clean up.');
      }
    };
  }, []); // Runs once when the component mounts

  return (
    <FeedContext.Provider value={{ feed, setFeed }}>
      {children}
    </FeedContext.Provider>
  );
};
