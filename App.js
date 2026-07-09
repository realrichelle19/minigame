import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { GameProvider } from './src/context/GameContext';
import { StatusBar, View, StyleSheet, Platform } from 'react-native';

export default function App() {
  return (
    <SafeAreaProvider>
      <GameProvider>
        <View style={styles.webContainer}>
          <View style={styles.mobileFrame}>
            <NavigationContainer>
              <StatusBar barStyle="light-content" />
              <AppNavigator />
            </NavigationContainer>
          </View>
        </View>
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#222' : '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        maxWidth: 400, // Typical phone width
        maxHeight: 850, // Typical phone height
        borderWidth: 8,
        borderColor: '#111',
        borderRadius: 40, // Rounded corners like a phone
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        marginVertical: 20,
      },
      default: {
        maxWidth: '100%',
        maxHeight: '100%',
      }
    })
  }
});
