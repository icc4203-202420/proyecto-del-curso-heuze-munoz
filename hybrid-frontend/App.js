import React, { useEffect, useState } from 'react';
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
import * as SecureStore from 'expo-secure-store';

const Stack = createNativeStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkLoginStatus = async () => {
    const token = await SecureStore.getItemAsync('authToken');
    console.log('Token:', token);
    setIsLoggedIn(!!token);
    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (loading) {
    return null; // O un componente de carga
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Ocultar el encabezado solo en Home
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
