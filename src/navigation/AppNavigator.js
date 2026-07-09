import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import RatingsScreen from '../screens/RatingsScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import RulesScreen from '../screens/RulesScreen';
import VictoryScreen from '../screens/VictoryScreen';
import HeroesScreen from '../screens/HeroesScreen';
import RankingScreen from '../screens/RankingScreen';
import InvestigationsScreen from '../screens/InvestigationsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="RoleSelection">
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Stack.Screen name="Ratings" component={RatingsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Investigations" component={InvestigationsScreen} />
      <Stack.Screen name="Rules" component={RulesScreen} />
      <Stack.Screen name="Game" component={GameScreen} />
      <Stack.Screen name="Victory" component={VictoryScreen} />
      <Stack.Screen name="Heroes" component={HeroesScreen} />
      <Stack.Screen name="Ranking" component={RankingScreen} />
    </Stack.Navigator>
  );
}
