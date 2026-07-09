import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';
import { GameContext } from '../context/GameContext';

export default function RulesScreen({ navigation }) {
  const { isAdmin, resetRatings } = useContext(GameContext);

  const handleReset = () => {
    Alert.alert(
      'RESET ALL RATINGS',
      'Are you sure you want to permanently delete all team feedback ratings?',
      [
        { text: 'CANCEL', style: 'cancel' },
        { 
          text: 'RESET', 
          style: 'destructive',
          onPress: async () => {
            await resetRatings();
            alert('ALL FEEDBACK RATINGS HAVE BEEN RESET.');
          }
        }
      ]
    );
  };

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

        {/* Reset button for Admin only */}
        {isAdmin && (
          <TouchableOpacity 
            style={styles.resetBtnShadow}
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <View style={styles.resetBtn}>
              <Ionicons name="trash-outline" size={20} color="#fff" style={styles.resetBtnIcon} />
              <Text style={styles.resetBtnText}>RESET ALL RATINGS</Text>
            </View>
          </TouchableOpacity>
        )}

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
  },
  resetBtnShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginTop: 25,
  },
  resetBtn: {
    backgroundColor: '#dc2626',
    borderWidth: 4,
    borderColor: '#000',
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  resetBtnIcon: {
    marginRight: 10,
  },
  resetBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  }
});
