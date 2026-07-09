import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { GameProvider } from './src/context/GameContext';
import { StatusBar, View, StyleSheet, Platform, LogBox } from 'react-native';

// Silence library deprecation logs on both web and mobile consoles
LogBox.ignoreAllLogs(true);
if (__DEV__) {
  const ignoreWarns = [
    'props.pointerEvents is deprecated',
    'shadow* style props are deprecated',
    'textShadow* style props are deprecated',
    'TouchableWithoutFeedback is deprecated',
    'Blocked aria-hidden on an element'
  ];
  const warn = console.warn;
  console.warn = function (...args) {
    if (args.length > 0 && typeof args[0] === 'string' && ignoreWarns.some(log => args[0].includes(log))) {
      return;
    }
    warn.apply(console, args);
  };
}

export default function App() {
  // If running on actual native devices (iOS/Android), render full screen without simulated frame wrapper
  if (Platform.OS !== 'web') {
    return (
      <SafeAreaProvider>
        <GameProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
          </NavigationContainer>
        </GameProvider>
      </SafeAreaProvider>
    );
  }

  // If running on web, wrap inside a high-fidelity mobile device frame simulation
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
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileFrame: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    overflow: 'hidden',
    maxWidth: 420, // Responsive phone width limit on desktop browsers
    maxHeight: 880, // Responsive phone height limit on desktop browsers
    borderWidth: 8,
    borderColor: '#111',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    marginVertical: 15,
  }
});
