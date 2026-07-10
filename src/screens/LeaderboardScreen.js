import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export default function LeaderboardScreen({ navigation }) {
  const { teams = [], deleteTeam, isAdmin, logoutProfile } = useContext(GameContext);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sorting logic:
  // 1. Teams with clearTime (finished speedruns) ranked ascending (fastest first)
  // 2. Teams without clearTime grouped at the bottom
  const rankedTeams = [...teams]
    .filter(t => t.clearTime !== null && t.clearTime !== undefined)
    .sort((a, b) => a.clearTime - b.clearTime);

  const unrankedTeams = [...teams].filter(
    t => t.clearTime === null || t.clearTime === undefined
  );

  const allTeamsSorted = [...rankedTeams, ...unrankedTeams];

  const getRankBadgeColor = (index) => {
    if (index === 0) return '#facc15'; // Gold
    if (index === 1) return '#cbd5e1'; // Silver
    if (index === 2) return '#ca8a04'; // Bronze
    return '#e5e7eb'; // Light Grey
  };

  const handleAdminLogout = () => {
    logoutProfile();
    navigation.replace('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      
      {/* Admin Quick Status Bar */}
      <View style={styles.adminStatusBar}>
        <Text style={styles.adminStatusText}>MODE: ADMINISTRATIVE CONSOLE (CN)</Text>
        <TouchableOpacity style={styles.logoutBadge} onPress={handleAdminLogout}>
          <Text style={styles.logoutBadgeText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.titleRow}>
          <Ionicons name="trophy" size={32} color="#b91c1c" />
          <Text style={styles.pageTitle}>VIGILANTE LEADERBOARD</Text>
        </View>

        <Text style={styles.subtitle}>Speedrun rankings based on clear time attempts.</Text>

        {/* Leaderboard Card List */}
        {allTeamsSorted.length > 0 ? (
          allTeamsSorted.map((t, idx) => {
            const hasCleared = t.clearTime !== null && t.clearTime !== undefined;
            const isTopThree = idx < 3 && hasCleared;
            
            return (
              <View key={t.id} style={styles.rankCardShadow}>
                <View style={[styles.rankCard, t.isAdminRun && { backgroundColor: '#fef2f2' }]}>
                  
                  {/* Rank Badge & Team name */}
                  <View style={styles.rankCardHeader}>
                    <View style={styles.teamInfoLeft}>
                      <View 
                        style={[
                          styles.rankBadge, 
                          { backgroundColor: t.isAdminRun ? '#ef4444' : (hasCleared ? getRankBadgeColor(idx) : '#e5e7eb') }
                        ]}
                      >
                        <Text style={[styles.rankBadgeText, t.isAdminRun && { color: '#fff' }]}>
                          {t.isAdminRun ? 'A' : (hasCleared ? `#${idx + 1}` : 'U')}
                        </Text>
                      </View>
                      <Text style={styles.teamName}>{t.name}</Text>
                      {t.isAdminRun && (
                        <View style={styles.adminBadge}>
                          <Text style={styles.adminBadgeText}>ADMIN RUN</Text>
                        </View>
                      )}
                    </View>

                    {/* Completion Status Badge */}
                    {t.isCompleted && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>COMPLETED</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.divider} />

                  {/* Leaderboard statistics */}
                  <View style={styles.statsRow}>
                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>BEST CLEAR TIME</Text>
                      <Text style={[styles.statValue, hasCleared ? styles.textHighlight : null]}>
                        {hasCleared ? formatTime(t.clearTime) : 'PENDING'}
                      </Text>
                    </View>

                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>POINTS</Text>
                      <Text style={[styles.statValue, t.isAdminRun ? styles.adminTextHighlight : styles.playerTextHighlight]}>
                        {t.points !== undefined ? `${t.points} PTS` : 'N/A'}
                      </Text>
                    </View>
                    
                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>TOTAL RUNS</Text>
                      <Text style={styles.statValue}>{t.gamesPlayed || 1}</Text>
                    </View>

                    <View style={styles.statCol}>
                      <Text style={styles.statLabel}>ATTEMPTS</Text>
                      <Text style={styles.statValue}>
                        {t.attempts ? t.attempts.length : (hasCleared ? 1 : 0)}
                      </Text>
                    </View>
                  </View>

                  {/* Attempt Log array (visual list of all speedrun times) */}
                  {t.attempts && t.attempts.length > 0 && (
                    <View style={styles.attemptsLogContainer}>
                      <Text style={styles.attemptsLogLabel}>ATTEMPT LOGS:</Text>
                      <Text style={styles.attemptsLogText}>
                        {t.attempts.map((att, index) => `#${index + 1}: ${formatTime(att)}`).join('  |  ')}
                      </Text>
                    </View>
                  )}

                  {/* Admin Actions (Delete Roster Entry) */}
                  {isAdmin && (
                    <TouchableOpacity 
                      style={styles.deleteBtnShadow} 
                      onPress={() => deleteTeam(t.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.deleteBtn}>
                        <Ionicons name="trash-outline" size={16} color="#fff" style={styles.deleteIcon} />
                        <Text style={styles.deleteBtnText}>DELETE TEAM RECORD</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.rankCardShadow}>
            <View style={styles.rankCard}>
              <Text style={styles.teamName}>NO VIGILANTES REGISTERED</Text>
              <Text style={styles.subtitle}>Records will populate once teams register and start runs.</Text>
            </View>
          </View>
        )}

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
  adminStatusBar: {
    backgroundColor: '#000',
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminStatusText: {
    color: '#10b981', // green text
    fontWeight: '900',
    fontSize: 11,
    letterSpacing: 1,
  },
  logoutBadge: {
    backgroundColor: '#b91c1c',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#fff',
  },
  logoutBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
    fontStyle: 'italic',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 25,
  },
  // Cards
  rankCardShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 20,
  },
  rankCard: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  rankCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    borderWidth: 2,
    borderColor: '#000',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankBadgeText: {
    fontSize: 14,
    fontWeight: '950',
    color: '#000',
  },
  teamName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
  },
  completedBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 2,
    borderColor: '#000',
  },
  completedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  divider: {
    height: 2,
    backgroundColor: '#000',
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCol: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },
  textHighlight: {
    color: '#b91c1c',
    fontStyle: 'italic',
  },
  attemptsLogContainer: {
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    marginBottom: 15,
  },
  attemptsLogLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  attemptsLogText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    fontStyle: 'italic',
  },
  // Delete Button styling
  deleteBtnShadow: {
    backgroundColor: '#000',
    marginTop: 5,
  },
  deleteBtn: {
    backgroundColor: '#dc2626',
    borderWidth: 2,
    borderColor: '#000',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '950',
    letterSpacing: 0.5,
  },
  deleteIcon: {
    marginRight: 6,
  },
  adminBadge: {
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 12,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  adminTextHighlight: {
    color: '#ef4444',
    fontWeight: '900',
  },
  playerTextHighlight: {
    color: '#1d4ed8',
    fontWeight: '900',
  }
});
