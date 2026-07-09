import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

export default function HeroesScreen({ navigation }) {
  const { 
    teams = [], 
    deleteTeam, 
    markTeamCompleted, 
    completedMissions = [],
    teamProfile,
    logoutProfile,
    isAdmin
  } = useContext(GameContext);

  const allRoundsCompleted = completedMissions.length === 3;

  const handleDeleteTeam = (id, name) => {
    deleteTeam(id);
    if (teamProfile && teamProfile.teamName === name) {
      logoutProfile();
      navigation.replace('Login');
    }
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>VIGILANTE ROSTER</Text>

        {/* Display Logged-in Active Team Name Directly at the Top */}
        <View style={styles.activeTeamCardShadow}>
          <View style={styles.activeTeamCard}>
            <Text style={styles.activeTeamLabel}>ACTIVE VIGILANTE TEAM</Text>
            <Text style={styles.activeTeamValue}>
              {teamProfile?.teamName ? teamProfile.teamName : 'NO ACTIVE TEAM'}
            </Text>
            {teamProfile && (
              <View style={styles.activeTeamSub}>
                <Text style={styles.activeTeamSubText}>Leader: {teamProfile.leaderName}</Text>
                <Text style={styles.activeTeamSubText}>Members: {teamProfile.membersCount}</Text>
              </View>
            )}
          </View>
        </View>

        <Text style={styles.sectionTitle}>REGISTERED TEAM HISTORY</Text>

        {/* Display Current Registered Teams List */}
        {teams.length > 0 ? (
          teams.map((t) => (
            <View key={t.id} style={styles.teamCardShadow}>
              <View style={styles.teamCard}>
                <View style={styles.teamCardHeader}>
                  <Text style={styles.teamLabel}>TEAM PROFILE</Text>
                  {t.isCompleted && (
                    <View style={styles.completedBadge}>
                      <Text style={styles.completedBadgeText}>COMPLETED</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.teamValue}>{t.name}</Text>
                
                <View style={styles.statsRosterRow}>
                  <Text style={styles.teamStatsLabel}>GAMES PLAYED: </Text>
                  <Text style={styles.teamStatsValue}>{t.gamesPlayed || 1}</Text>
                </View>

                {((t.attempts && t.attempts.length > 0) || (t.clearTime !== null && t.clearTime !== undefined)) ? (
                  <View style={styles.attemptsContainer}>
                    <Text style={styles.teamStatsLabel}>COMPLETED ATTEMPTS:</Text>
                    <Text style={styles.attemptsList}>
                      {(t.attempts && t.attempts.length > 0 ? t.attempts : [t.clearTime])
                        .map((att, idx) => `#${idx + 1}: ${formatTime(att)}`)
                        .join('  |  ')}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noAttemptsText}>NO COMPLETED ATTEMPTS YET</Text>
                )}

                <View style={styles.actionsContainer}>
                  {/* Complete Task Option (only shows if all 3 rounds are locked and team isn't already completed) */}
                  {allRoundsCompleted && !t.isCompleted && (
                    <TouchableOpacity 
                      style={styles.completeBtnShadow}
                      onPress={() => markTeamCompleted(t.id)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.completeBtn}>
                        <Text style={styles.completeBtnText}>COMPLETE TASK</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Delete Button (Admin Only) */}
                  {isAdmin && (
                    <TouchableOpacity 
                      style={styles.deleteBtnShadow}
                      onPress={() => handleDeleteTeam(t.id, t.name)}
                      activeOpacity={0.8}
                    >
                      <View style={styles.deleteBtn}>
                        <Text style={styles.deleteBtnText}>DELETE</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.teamCardShadow}>
            <View style={styles.teamCard}>
              <Text style={styles.teamLabel}>ROSTER STATUS</Text>
              <Text style={styles.teamValue}>NO ACTIVE TEAMS REGISTERED</Text>
            </View>
          </View>
        )}

      </ScrollView>
      <BottomNavBar activeTab="HEROES" navigation={navigation} />
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
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    marginBottom: 20,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginBottom: 15,
    marginTop: 10,
    letterSpacing: 0.5,
  },
  // Active Team Card (at the top)
  activeTeamCardShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 25,
  },
  activeTeamCard: {
    backgroundColor: '#b91c1c', // Premium red backing
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  activeTeamLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 5,
  },
  activeTeamValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  activeTeamSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#000',
    paddingTop: 10,
    marginTop: 5,
  },
  activeTeamSubText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Saved Team Display Card
  teamCardShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 20,
  },
  teamCard: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  teamCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  teamLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    letterSpacing: 1,
  },
  teamValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  clearTimeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#b91c1c',
    letterSpacing: 0.5,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  statsRosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamStatsLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
  },
  teamStatsValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
  },
  attemptsContainer: {
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  attemptsList: {
    fontSize: 13,
    fontWeight: '900',
    color: '#b91c1c',
    fontStyle: 'italic',
    marginTop: 4,
  },
  noAttemptsText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 15,
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
  // Team Card Actions
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  completeBtnShadow: {
    marginRight: 12,
    backgroundColor: '#000',
  },
  completeBtn: {
    backgroundColor: '#16a34a',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  completeBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
  deleteBtnShadow: {
    backgroundColor: '#000',
  },
  deleteBtn: {
    backgroundColor: '#dc2626',
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    transform: [{ translateX: -3 }, { translateY: -3 }],
  },
  deleteBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  }
});
