import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Share } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export default function RankingScreen({ navigation }) {
  const { score, totalRounds, victimsSaved, restartGame } = useContext(GameContext);

  // Fallbacks if player hasn't completed a mission yet to match the design spec exactly
  const displayScore = score || 8500;
  const displayVictims = victimsSaved || 15;
  const displayVillainsCount = score > 0 ? Math.min(totalRounds, Math.ceil(score / 1500)) : 6; 

  const handleReplay = () => {
    restartGame();
    navigation.navigate('Game');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I defeated the Sinister Six in the Web of Riddles game! Scored ${displayScore} points and saved ${displayVictims} victims! Can you beat my rank? 🕷️🕸️`,
      });
    } catch (error) {
      console.log('Share error:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Title Area */}
        <Text style={styles.mainTitle}>SINISTER SIX DEFEATED!</Text>
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
            {/* THWIP Star graphic */}
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
              <Text style={styles.pointsValue}>{displayScore}</Text>
              <Ionicons name="star" size={32} color="#b91c1c" />
            </View>

            <View style={styles.villainsRow}>
              <Text style={styles.label}>VILLAINS DEFEATED</Text>
              <Text style={styles.villainsCount}>{displayVillainsCount}/{totalRounds || 6}</Text>
            </View>
            
            <View style={styles.threatBar}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.threatSegment, 
                    idx < displayVillainsCount ? styles.threatSegmentFilled : null
                  ]} 
                />
              ))}
            </View>

            <View style={styles.statsRow}>
              <View style={[styles.statBoxShadow, { flex: 1, marginRight: 15 }]}>
                <View style={styles.statBox}>
                  <Text style={styles.statBoxLabel}>VICTIMS RESCUED</Text>
                  <Text style={styles.statBoxValue}>{displayVictims}</Text>
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

        {/* Bottom Buttons */}
        <TouchableOpacity 
          style={styles.replayBtnShadow} 
          onPress={handleReplay}
          activeOpacity={0.8}
        >
          <View style={styles.replayBtn}>
            <Text style={styles.replayBtnText}>REPLAY MISSION</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.shareBtnShadow} 
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <View style={styles.shareBtn}>
            <Ionicons name="share-social-outline" size={24} color="#000" style={styles.shareIcon} />
            <Text style={styles.shareBtnText}>SHARE RESULTS</Text>
          </View>
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
    fontStyle: 'italic',
    marginBottom: 5,
  },
  badgeShadow: {
    backgroundColor: '#000',
    marginBottom: 25,
  },
  badge: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 15,
    transform: [{ translateX: -3 }, { translateY: -3 }],
    borderWidth: 2,
    borderColor: '#000',
  },
  badgeText: {
    color: '#fff',
    fontWeight: '900',
    letterSpacing: 1,
    fontSize: 12,
  },
  // Graphic Box
  graphicShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 25,
  },
  graphicBox: {
    width: '100%',
    backgroundColor: '#e6e6fa', // Light lavender
    borderWidth: 4,
    borderColor: '#000',
    padding: 30,
    transform: [{ translateX: -6 }, { translateY: -6 }],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  graphicText: {
    fontWeight: '900',
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  graphicSubText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  thwipStar: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    backgroundColor: '#b91c1c',
    borderWidth: 3,
    borderColor: '#000',
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
    marginBottom: 25,
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
    color: '#000',
  },
  logDivider: {
    height: 3,
    backgroundColor: '#000',
    marginVertical: 12,
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
    marginBottom: 8,
  },
  villainsCount: {
    fontWeight: '900',
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
    backgroundColor: '#ddd',
    marginHorizontal: 1,
  },
  threatSegmentFilled: {
    backgroundColor: '#b91c1c',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBoxShadow: {
    backgroundColor: '#000',
  },
  statBox: {
    backgroundColor: '#f3f4f6',
    borderWidth: 3,
    borderColor: '#000',
    padding: 12,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
  },
  statBoxLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
  },
  statBoxValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
  },
  rankBoxShadow: {
    backgroundColor: '#000',
  },
  rankBox: {
    backgroundColor: '#5c5c99', // Purple
    borderWidth: 3,
    borderColor: '#000',
    padding: 12,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    justifyContent: 'center',
  },
  rankBoxLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.8,
    marginBottom: 5,
  },
  rankBoxValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },
  // Bottom Buttons
  replayBtnShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 15,
  },
  replayBtn: {
    backgroundColor: '#b91c1c',
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
  },
  replayBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 22,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  shareBtnShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 15,
  },
  shareBtn: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {
    marginRight: 10,
  },
  shareBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: 1,
  }
});
