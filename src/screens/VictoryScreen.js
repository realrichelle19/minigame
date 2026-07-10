import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export default function VictoryScreen({ navigation }) {
  const { score, totalRounds, victimsSaved, restartGame, debt, timerResetPenalty } = useContext(GameContext);

  const handleRestart = () => {
    restartGame();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Title Area */}
        <Text style={styles.mainTitle}>ALL VILLAINS DEFEATED!</Text>
        <View style={styles.badgeShadow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>MISSION ACCOMPLISHED</Text>
          </View>
        </View>

        {/* Graphic Box */}
        <View style={styles.graphicShadow}>
          <View style={styles.graphicBox}>
            <Text style={styles.graphicText}>MISSION ACCOMPLISHED</Text>
            <Text style={styles.graphicSubText}>Fantastic work. Your goals have been achieved.</Text>
            {/* Faux THWIP Star graphic */}
            <View style={styles.thwipStar}>
              <Text style={styles.thwipText}>THWIP!</Text>
            </View>
          </View>
        </View>

        {/* Mission Log */}
        <View style={styles.logShadow}>
          <View style={styles.logCard}>
            <Text style={styles.logTitle}>MISSION LOG</Text>
            <View style={styles.logDivider} />

            <Text style={styles.label}>TOTAL POINTS</Text>
            <View style={styles.pointsRow}>
              <Text style={styles.pointsValue}>{Math.max(0, 1600 - (timerResetPenalty || 0))}</Text>
              <Ionicons name="star" size={32} color="#b91c1c" />
            </View>

            <View style={styles.villainsRow}>
              <Text style={styles.label}>VILLAINS DEFEATED</Text>
              <Text style={styles.villainsCount}>{totalRounds}/{totalRounds}</Text>
            </View>
            
            <View style={styles.threatBar}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <View key={idx} style={styles.threatSegment} />
              ))}
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statBoxShadow, { flex: 1, marginRight: 10 }]}>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxLabel}>VICTIMS RESCUED</Text>
                  <Text style={styles.statBoxValue}>{victimsSaved}</Text>
                </View>
              </View>

              <View style={[styles.rankBoxShadow, { flex: 1 }]}>
                <View style={styles.rankBox}>
                  <Text style={styles.rankBoxLabel}>NEW RANK</Text>
                  <Text style={styles.rankBoxValue}>AVENGERS RECRUIT</Text>
                </View>
              </View>
            </View>

          </View>
        </View>

        {/* Temp restart button */}
        <TouchableOpacity style={{marginTop: 20}} onPress={handleRestart}>
          <Text style={{color: '#888', fontWeight: 'bold'}}>PLAY AGAIN</Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomNavBar activeTab="RANKING" navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  // Title
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#b91c1c',
    textAlign: 'center',
    letterSpacing: -1,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 5,
  },
  badgeShadow: {
    backgroundColor: '#000',
    marginBottom: 20,
  },
  badge: {
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 15,
    transform: [{ translateX: -3 }, { translateY: -3 }],
    borderWidth: 2,
    borderColor: '#000',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 1,
  },
  // Graphic Box
  graphicShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 20,
  },
  graphicBox: {
    width: '100%',
    backgroundColor: '#e6e6fa', // Light gradientish color
    borderWidth: 4,
    borderColor: '#000',
    padding: 30,
    transform: [{ translateX: -6 }, { translateY: -6 }],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  graphicText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  graphicSubText: {
    fontSize: 10,
    color: '#666',
  },
  thwipStar: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#b91c1c',
    padding: 10,
    transform: [{ rotate: '-15deg' }],
  },
  thwipText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 24,
    fontStyle: 'italic',
  },
  // Mission Log
  logShadow: {
    width: '100%',
    backgroundColor: '#000',
  },
  logCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  logTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logDivider: {
    height: 2,
    backgroundColor: '#000',
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    letterSpacing: 1,
  },
  pointsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#b91c1c',
  },
  villainsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  villainsCount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  threatBar: {
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: '#000',
    padding: 2,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  threatSegment: {
    flex: 1,
    height: 15,
    backgroundColor: '#b91c1c', // all full
    marginHorizontal: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBoxShadow: {
    backgroundColor: '#000',
  },
  statBox: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    padding: 10,
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  statBoxLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  statBoxValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  rankBoxShadow: {
    backgroundColor: '#000',
  },
  rankBox: {
    backgroundColor: '#5c5c99', // Purple
    borderWidth: 3,
    borderColor: '#000',
    padding: 10,
    transform: [{ translateX: -3 }, { translateY: -3 }],
    height: '100%',
    justifyContent: 'center',
  },
  rankBoxLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.8,
  },
  rankBoxValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
  }
});
