import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { completedMissions = [], isAdmin, teams = [], feedbackRatings = [], adminName, saveAdminName, deleteTeam, debt, timerResetPenalty } = useContext(GameContext);

  const handleStartMission = () => {
    if (isAdmin) {
      let name = "CN";
      if (typeof window !== 'undefined' && window.prompt) {
        const input = window.prompt("ENTER YOUR ADMIN NAME:", adminName || "CN");
        if (input === null) return; // user cancelled starting the mission
        name = input.trim() || "CN";
      }
      saveAdminName(name);
    }
    navigation.navigate('Investigations');
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankBadgeColor = (index) => {
    if (index === 0) return '#facc15'; // Gold
    if (index === 1) return '#cbd5e1'; // Silver
    if (index === 2) return '#ca8a04'; // Bronze
    return '#e5e7eb'; // Light Grey
  };

  const rankedTeams = [...(teams || [])]
    .filter(t => t.clearTime !== null && t.clearTime !== undefined)
    .sort((a, b) => a.clearTime - b.clearTime);

  const unrankedTeams = [...(teams || [])].filter(
    t => t.clearTime === null || t.clearTime === undefined
  );

  const allTeamsSorted = [...rankedTeams, ...unrankedTeams];

  // Calculate vigilanteStatsScore as 1600 minus timerResetPenalty
  const vigilanteStatsScore = Math.max(0, 1600 - (timerResetPenalty || 0));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Main Mission Card */}
          <View style={styles.mainCardShadow}>
            <View style={styles.mainCard}>
              <Text style={styles.threatLevel}>THREAT LEVEL:</Text>
              <Text style={styles.critical}>CRITICAL</Text>
              <Text style={styles.saviorText}>SRM NEEDS A SAVIOR</Text>
              
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
                <Text style={styles.statsValue}>{vigilanteStatsScore}</Text>
              </View>
              <View style={styles.statsLine} />
            </View>
          </View>

          {/* Admin Leaderboard & Ratings Sections */}
          {isAdmin && (
            <>
              {/* Leaderboard Card */}
              <View style={styles.adminSectionCardShadow}>
                <View style={styles.adminSectionCard}>
                  <View style={styles.statsHeader}>
                    <Ionicons name="trophy" size={24} color="#b91c1c" />
                    <Text style={styles.statsTitle}>ADMIN LEADERBOARD</Text>
                  </View>

                  {allTeamsSorted.length > 0 ? (
                    allTeamsSorted.map((t, idx) => {
                      const hasCleared = t.clearTime !== null && t.clearTime !== undefined;
                      return (
                        <View key={t.id} style={[styles.leaderboardRowContainer, t.isAdminRun && { backgroundColor: '#fef2f2', paddingHorizontal: 6 }]}>
                          <View style={styles.leaderboardRow}>
                            <View style={styles.leaderboardTeamInfo}>
                              <View 
                                style={[
                                  styles.rankBadgeMini, 
                                  { backgroundColor: t.isAdminRun ? '#ef4444' : (hasCleared ? getRankBadgeColor(idx) : '#e5e7eb') }
                                ]}
                              >
                                <Text style={[styles.rankBadgeMiniText, t.isAdminRun && { color: '#fff' }]}>
                                  {t.isAdminRun ? 'A' : (hasCleared ? `#${idx + 1}` : 'U')}
                                </Text>
                              </View>
                              <Text style={styles.leaderboardTeamName}>{t.name}</Text>
                              {t.isAdminRun && (
                                <View style={styles.adminBadgeMini}>
                                  <Text style={styles.adminBadgeMiniText}>ADMIN RUN</Text>
                                </View>
                              )}
                            </View>
                            
                            <View style={styles.leaderboardStatusInfo}>
                              {t.isCompleted && (
                                <View style={styles.completedBadgeMini}>
                                  <Text style={styles.completedBadgeMiniText}>COMPLETED</Text>
                                </View>
                              )}
                              <Text style={[styles.leaderboardPointsMini, t.isAdminRun ? styles.adminPointsHighlight : styles.playerPointsHighlight]}>
                                {t.points !== undefined ? `${t.points} PTS` : 'N/A'}
                              </Text>
                              <Text style={styles.leaderboardTime}>
                                {hasCleared ? formatTime(t.clearTime) : 'PENDING'}
                              </Text>
                            </View>
                          </View>

                          {/* Delete Option */}
                          <TouchableOpacity 
                            style={styles.deleteBtnMiniShadow}
                            onPress={() => deleteTeam(t.id)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.deleteBtnMini}>
                              <Ionicons name="trash-outline" size={14} color="#fff" style={{ marginRight: 4 }} />
                              <Text style={styles.deleteBtnMiniText}>DELETE RECORD</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.noDataText}>NO TEAMS REGISTERED</Text>
                  )}
                </View>
              </View>

              {/* Ratings Card */}
              <View style={styles.adminSectionCardShadow}>
                <View style={styles.adminSectionCard}>
                  <View style={styles.statsHeader}>
                    <Ionicons name="star" size={24} color="#b91c1c" />
                    <Text style={styles.statsTitle}>FEEDBACK RATINGS</Text>
                  </View>

                  {feedbackRatings && feedbackRatings.length > 0 ? (
                    feedbackRatings.map((rate) => (
                      <View key={rate.id} style={styles.ratingCardItem}>
                        <View style={styles.ratingRowHeader}>
                          <Text style={styles.ratingTeamName}>{rate.teamName}</Text>
                          <Text style={styles.ratingMembers}>{rate.membersCount} MEM</Text>
                        </View>
                        <View style={styles.ratingGrid}>
                          <Text style={styles.ratingGridText}>EXP: {rate.overallExperience}/5</Text>
                          <Text style={styles.ratingGridText}>CON: {rate.eventContent}/5</Text>
                          <Text style={styles.ratingGridText}>LOG: {rate.logistics}/5</Text>
                          <Text style={styles.ratingGridText}>VOL: {rate.volunteers}/5</Text>
                          <Text style={styles.ratingGridText}>FUT: {rate.futureInterests}/5</Text>
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noDataText}>NO RATINGS SUBMITTED YET</Text>
                  )}
                </View>
              </View>
            </>
          )}
          
        </View>
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
  },
  scrollContainer: {
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  adminSectionCardShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginTop: 25,
  },
  adminSectionCard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: 4,
    borderColor: '#000',
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  leaderboardTeamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#b91c1c',
    marginRight: 10,
    width: 25,
  },
  leaderboardTeamName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },
  leaderboardTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  noDataText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  ratingCardItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  ratingRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingTeamName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },
  ratingMembers: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ratingGridText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
  },
  leaderboardRowContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingVertical: 12,
  },
  rankBadgeMini: {
    borderWidth: 2,
    borderColor: '#000',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rankBadgeMiniText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
  },
  leaderboardStatusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadgeMini: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 8,
  },
  completedBadgeMiniText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },
  deleteBtnMiniShadow: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  deleteBtnMini: {
    backgroundColor: '#dc2626',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    transform: [{ translateX: -2 }, { translateY: -2 }],
  },
  deleteBtnMiniText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  adminBadgeMini: {
    backgroundColor: '#ef4444',
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 8,
  },
  adminBadgeMiniText: {
    color: '#fff',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  leaderboardPointsMini: {
    fontSize: 12,
    fontWeight: '900',
    marginRight: 8,
  },
  adminPointsHighlight: {
    color: '#ef4444',
  },
  playerPointsHighlight: {
    color: '#1d4ed8',
  }
});
