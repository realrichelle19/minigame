import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export default function RulesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.titleBoxShadow}>
          <View style={styles.titleBox}>
            <Ionicons name="information-circle" size={32} color="#fff" />
            <Text style={styles.pageTitle}>MISSION INTEL</Text>
          </View>
        </View>

        <View style={styles.intelCardShadow}>
          <View style={styles.intelCard}>
            <Text style={styles.ruleTitle}>1. THREATS</Text>
            <Text style={styles.ruleText}>Solve each villain's riddle to defeat them and rescue innocent civilians.</Text>
            
            <View style={styles.divider} />

            <Text style={styles.ruleTitle}>2. TIME IS TICKING</Text>
            <Text style={styles.ruleText}>Every round has a countdown timer (Spidey-Sense). The harder the villain, the less time you have!</Text>
            
            <View style={styles.divider} />

            <Text style={styles.ruleTitle}>3. COST OF FAILURE</Text>
            <Text style={styles.ruleText}>If the timer reaches zero, you lose all progress and restart from Round 1. You also accrue DEBT (lose half your earned points)!</Text>
            
            <View style={styles.divider} />

            <Text style={styles.ruleTitle}>4. VICTORY</Text>
            <Text style={styles.ruleText}>Defeat all villains sequentially to rescue every victim and save the city!</Text>
          </View>
        </View>

      </ScrollView>
      <BottomNavBar activeTab="INTEL" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  titleBoxShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 30,
  },
  titleBox: {
    backgroundColor: '#1d4ed8', // Intel Blue
    borderWidth: 4,
    borderColor: '#000',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginLeft: 10,
    letterSpacing: 1,
  },
  intelCardShadow: {
    width: '100%',
    backgroundColor: '#000',
  },
  intelCard: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  ruleTitle: {
    color: '#b91c1c',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 5,
    letterSpacing: 1,
  },
  ruleText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  divider: {
    height: 3,
    backgroundColor: '#000',
    marginVertical: 15,
  }
});
