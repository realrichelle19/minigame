import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { score } = useContext(GameContext);

  const handleStartMission = () => {
    navigation.navigate('Investigations');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        
        {/* Main Mission Card */}
        <View style={styles.mainCardShadow}>
          <View style={styles.mainCard}>
            <Text style={styles.threatLevel}>THREAT LEVEL:</Text>
            <Text style={styles.critical}>CRITICAL</Text>
            <Text style={styles.saviorText}>NYC NEEDS A SAVIOR</Text>
            
            <TouchableOpacity 
              style={styles.startButtonShadow}
              onPress={handleStartMission}
              activeOpacity={0.8}
            >
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>START MISSION</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCardShadow}>
          <View style={styles.statsCard}>
            <View style={styles.statsHeader}>
              <Ionicons name="stats-chart" size={24} color="#b91c1c" />
              <Text style={styles.statsTitle}>VIGILANTE STATS</Text>
            </View>
            
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>TOTAL POINTS</Text>
              <Text style={styles.statsValue}>{score}</Text>
            </View>
            <View style={styles.statsLine} />
          </View>
        </View>
        
      </View>
      <BottomNavBar activeTab="MISSIONS" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Off-white subtle background
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Neo-Brutalist Main Card
  mainCardShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 40,
  },
  mainCard: {
    width: '100%',
    backgroundColor: '#b91c1c', // Deep Red
    padding: 30,
    borderWidth: 4,
    borderColor: '#000',
    transform: [{ translateX: -6 }, { translateY: -6 }],
    alignItems: 'center',
  },
  threatLevel: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  critical: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 15,
  },
  saviorText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 40,
  },
  // Button
  startButtonShadow: {
    width: '100%',
    backgroundColor: '#000',
  },
  startButton: {
    backgroundColor: '#b91c1c',
    borderWidth: 4,
    borderColor: '#000',
    paddingVertical: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  // Stats Card
  statsCardShadow: {
    width: '100%',
    backgroundColor: '#000',
  },
  statsCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 4,
    borderColor: '#000',
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    marginLeft: 10,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    letterSpacing: 1,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#b91c1c',
  },
  statsLine: {
    height: 2,
    backgroundColor: '#ddd',
    width: '100%',
  }
});
