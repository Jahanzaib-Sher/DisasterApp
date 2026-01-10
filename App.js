import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DisasterProvider } from './src/context/DisasterContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <DisasterProvider>
      <SafeAreaProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </DisasterProvider>
  );
}







