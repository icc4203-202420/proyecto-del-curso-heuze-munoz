import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/screens/LoginScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import HomeScreen from './app/screens/HomeScreen';
import BeersScreen from './app/screens/BeersScreen';  // Nueva pantalla de Beers

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* Ocultamos el header solo en HomeScreen */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />

        {/* Nueva pantalla de Beers */}
        <Stack.Screen 
          name="Beers" 
          component={BeersScreen} 
          options={{ title: 'Beers List' }} // Encabezado personalizado
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
