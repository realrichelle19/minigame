import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { GameContext } from '../context/GameContext';

const investigations = [
  {
    id: 1,
    title: 'TOXIC SPILL RIDDLE',
    description: "Trace the chemicals back to Oscorp's secret lab before the city is flooded.",
    difficulty: 'HARD',
    color: '#b91c1c',
    points: 800
  },
  {
    id: 2,
    title: 'VAULT BREAKER',
    description: 'A high-tech thief is hacking the central bank. Stop the transfer now.',
    difficulty: 'MEDIUM',
    color: '#3b82f6', // Blue
    points: 500
  },
  {
    id: 3,
    title: 'THE ROOFTOP WITNESS',
    description: "Find the informant hiding in Hell's Kitchen. Keep your eyes peeled.",
    difficulty: 'EASY',
    color: '#b91c1c',
    points: 250
  }
];

export default function InvestigationsScreen({ navigation }) {
  const { restartGame } = useContext(GameContext);

  const handleInvestigate = () => {
    restartGame();
    setTimeout(() => {
      navigation.navigate('Game');
    }, 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>ACTIVE INVESTIGATIONS</Text>
          <View style={styles.titleLine} />
        </View>

        {investigations.map((inv) => (
          <View key={inv.id} style={styles.cardShadow}>
            <View style={styles.card}>
              
              {/* Image Placeholder */}
              <View style={styles.imagePlaceholder}>
                <View style={[styles.badge, { backgroundColor: inv.color }]}>
                  <Text style={styles.badgeText}>{inv.difficulty}</Text>
                </View>
              </View>

              <Text style={styles.cardTitle}>{inv.title}</Text>
              <Text style={styles.cardDesc}>{inv.description}</Text>
              
              <View style={styles.cardFooter}>
                <Text style={styles.points}>+{inv.points} PTS</Text>
                <TouchableOpacity 
                  style={styles.investigateBtn}
                  onPress={handleInvestigate}
                  activeOpacity={0.8}
                >
                  <Text style={styles.investigateBtnText}>INVESTIGATE</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        ))}

      </ScrollView>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
    marginRight: 10,
    letterSpacing: -0.5,
  },
  titleLine: {
    flex: 1,
    height: 3,
    backgroundColor: '#000',
  },
  cardShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
    borderWidth: 3,
    borderColor: '#000',
    marginBottom: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: '#000',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    fontWeight: '500',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  points: {
    color: '#b91c1c',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  investigateBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  investigateBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  }
});
