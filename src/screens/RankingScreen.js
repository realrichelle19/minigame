import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Share, Modal, Pressable, Platform } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export default function RankingScreen({ navigation }) {
  const { score, totalRounds, victimsSaved, promoteToNextLevel, completedMissions = [], gameElapsedTime, teamProfile, isAdmin, adminName } = useContext(GameContext);

  const numLocked = completedMissions.length;
  let displayScore = 0;
  let displayVictims = 0;
  let displayVillainsCount = 0;
  let displayRank = '--';

  if (numLocked === 3) {
    displayScore = 1600;
    displayVictims = 60;
    displayVillainsCount = 3;
    displayRank = 'AVENGERS RECRUIT';
  } else if (numLocked === 2) {
    displayScore = 850;
    displayVictims = 30;
    displayVillainsCount = 2;
    displayRank = 'AVENGERS RECRUIT';
  } else if (numLocked === 1) {
    displayScore = 400;
    displayVictims = 12;
    displayVillainsCount = 1;
    displayRank = 'AVENGERS RECRUIT';
  } else {
    // Default fallback (none locked)
    displayScore = 0;
    displayVictims = 0;
    displayVillainsCount = 0;
    displayRank = '--';
  }

  const isRound3Cleared = completedMissions.includes('toxic_spill');
  const titleText = isRound3Cleared ? 'THE VILLAINS ARE DEFEATED' : 'RESUME FIGHTING THE VILLAINS';
  const statusText = isRound3Cleared ? 'MISSION ACCOMPLISHED' : 'MISSION PENDING';

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const displayTime = gameElapsedTime;

  let btnText = 'DEFEAT ALL THE VILLAINS';
  if (numLocked === 3) {
    btnText = 'PROMOTED TO NEXT LEVEL';
  } else if (numLocked === 1 || numLocked === 2) {
    btnText = 'RESUME THE MISSION';
  }

  const handleReplay = () => {
    if (numLocked === 3) {
      promoteToNextLevel();
    }
    navigation.navigate('Investigations');
  };

  const [shareModalVisible, setShareModalVisible] = useState(false);

  const handleShare = () => {
    setShareModalVisible(true);
  };

  const triggerNativeShare = async () => {
    try {
      const teamName = teamProfile?.teamName || 'ANONYMOUS VIGILANTES';
      const teamLeader = teamProfile?.leaderName || 'N/A';
      const membersCount = teamProfile?.membersCount || '0';
      const timeStr = displayTime !== null && displayTime !== undefined ? formatTime(displayTime) : '--:--';
      
      const reportText = `============= CLASSIFIED MISSION REPORT =============
TEAM NAME: ${teamName}
TEAM LEADER: ${teamLeader}
TEAM SIZE: ${membersCount} MEMBER(S)
STATUS: ${statusText}
TOTAL POINTS: ${displayScore} PTS
VILLAINS CAPTURED: ${displayVillainsCount}/3
SPEEDRUN DURATION: ${timeStr}
RANK ASSIGNED: ${displayRank}
=====================================================`;
      
      await Share.share({
        message: reportText,
      });
      setShareModalVisible(false);
    } catch (error) {
      console.log('Share error:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Title Area */}
        <Text style={styles.mainTitle}>{titleText}</Text>
        <View style={styles.badgeShadow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{statusText}</Text>
          </View>
        </View>

        {/* Graphic Box */}
        <View style={styles.graphicShadow}>
          <View style={styles.graphicBox}>
            <Text style={styles.graphicText}>{statusText}</Text>
            <Text style={styles.graphicSubText}>
              {isRound3Cleared 
                ? 'Fantastic work. Your goals have been achieved.' 
                : 'Defeat all villains to save the city.'}
            </Text>
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
              <Text style={styles.villainsCount}>{displayVillainsCount}/3</Text>
            </View>
            
            <View style={styles.threatBar}>
              {Array.from({ length: 3 }).map((_, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.threatSegment, 
                    idx < displayVillainsCount ? styles.threatSegmentFilled : null
                  ]} 
                />
              ))}
            </View>

            {displayTime !== null && displayTime !== undefined && (
              <View style={styles.timeRow}>
                <Text style={styles.label}>ELAPSED TIME</Text>
                <Text style={styles.timeValue}>{formatTime(displayTime)}</Text>
              </View>
            )}

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
                  <Text style={styles.rankBoxValue}>{displayRank}</Text>
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
            <Text style={styles.replayBtnText}>{btnText}</Text>
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

      {/* Share Report Modal (Simulating image layout) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={shareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <Pressable style={styles.modalOverlayCenter} onPress={() => setShareModalVisible(false)}>
          <Pressable>
            <View style={styles.shareReportShadow}>
              <View style={styles.shareReportCard}>
                  
                  {/* Card Header */}
                  <View style={styles.reportHeader}>
                    <Text style={styles.reportTitle}>MISSION REPORT CARD</Text>
                    <TouchableOpacity onPress={() => setShareModalVisible(false)}>
                      <Ionicons name="close" size={32} color="#000" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.reportDivider} />

                  {/* Stamp Graphic */}
                  <View style={styles.classifiedStamp}>
                    <Text style={styles.classifiedStampText}>CLASSIFIED</Text>
                  </View>

                  {/* Team Profile details */}
                  <View style={styles.reportSection}>
                    <Text style={styles.reportLabel}>VIGILANTE GROUP</Text>
                    <Text style={styles.reportValue}>
                      {isAdmin ? 'Admin' : (teamProfile?.teamName || 'ANONYMOUS')}
                    </Text>
                  </View>

                  {isAdmin ? (
                    <View style={styles.reportRow}>
                      <View style={styles.reportHalf}>
                        <Text style={styles.reportLabel}>ADMIN NAME</Text>
                        <Text style={styles.reportValue}>{adminName || 'CN'}</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.reportRow}>
                      <View style={styles.reportHalf}>
                        <Text style={styles.reportLabel}>TEAM LEADER</Text>
                        <Text style={styles.reportValue}>{teamProfile?.leaderName || 'N/A'}</Text>
                      </View>
                      <View style={styles.reportHalf}>
                        <Text style={styles.reportLabel}>ACTIVE MEMBERS</Text>
                        <Text style={styles.reportValue}>{teamProfile?.membersCount || '0'}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.reportDividerDotted} />

                  {/* Mission Log details */}
                  <View style={styles.reportRow}>
                    <View style={styles.reportHalf}>
                      <Text style={styles.reportLabel}>TOTAL POINTS</Text>
                      <Text style={styles.reportValueHighlight}>{displayScore} PTS</Text>
                    </View>
                    <View style={styles.reportHalf}>
                      <Text style={styles.reportLabel}>CLEAR TIME</Text>
                      <Text style={styles.reportValueHighlight}>
                        {displayTime !== null && displayTime !== undefined ? formatTime(displayTime) : '--:--'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.reportRow}>
                    <View style={styles.reportHalf}>
                      <Text style={styles.reportLabel}>VILLAINS CAPTURED</Text>
                      <Text style={styles.reportValue}>{displayVillainsCount}/3</Text>
                    </View>
                    <View style={styles.reportHalf}>
                      <Text style={styles.reportLabel}>RANK ASSIGNED</Text>
                      <Text style={styles.reportValue}>{displayRank}</Text>
                    </View>
                  </View>

                  {/* Action buttons */}
                  <TouchableOpacity 
                    style={styles.actionBtnShadow}
                    onPress={() => {
                      try {
                        const groupName = isAdmin ? 'Admin' : (teamProfile?.teamName || 'ANONYMOUS VIGILANTES');
                        const timeStr = displayTime !== null && displayTime !== undefined ? formatTime(displayTime) : '--:--';

                        let reportText = '';
                        if (isAdmin) {
                          reportText = `============= CLASSIFIED MISSION REPORT =============
VIGILANTE GROUP: Admin
ADMIN NAME: ${adminName || 'CN'}
STATUS: ${statusText}
TOTAL POINTS: ${displayScore} PTS
VILLAINS CAPTURED: ${displayVillainsCount}/3
SPEEDRUN DURATION: ${timeStr}
RANK ASSIGNED: ${displayRank}
=====================================================`;
                        } else {
                          const teamLeader = teamProfile?.leaderName || 'N/A';
                          const membersCount = teamProfile?.membersCount || '0';
                          reportText = `============= CLASSIFIED MISSION REPORT =============
TEAM NAME: ${groupName}
TEAM LEADER: ${teamLeader}
TEAM SIZE: ${membersCount} MEMBER(S)
STATUS: ${statusText}
TOTAL POINTS: ${displayScore} PTS
VILLAINS CAPTURED: ${displayVillainsCount}/3
SPEEDRUN DURATION: ${timeStr}
RANK ASSIGNED: ${displayRank}
=====================================================`;
                        }

                        if (Platform.OS === 'web') {
                          const element = document.createElement("a");
                          const file = new Blob([reportText], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `mission_report_${groupName.replace(/\s+/g, '_')}.txt`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                        } else {
                          Share.share({
                            message: reportText,
                            title: 'Classified Mission Report',
                          });
                        }
                      } catch (err) {
                        console.log('Download error:', err.message);
                      }
                      
                      setShareModalVisible(false);
                      navigation.navigate('Ratings');
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={styles.actionBtn}>
                      <Ionicons name="star" size={20} color="#fff" style={styles.btnIcon} />
                      <Text style={styles.actionBtnText}>RATE CAMPUS QUEST '26</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            </Pressable>
          </Pressable>
      </Modal>

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
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderWidth: 3,
    borderColor: '#000',
  },
  timeValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#b91c1c',
    fontStyle: 'italic',
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
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  shareReportShadow: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#000',
  },
  shareReportCard: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: '950',
    color: '#000',
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  reportDivider: {
    height: 4,
    backgroundColor: '#000',
    marginVertical: 15,
  },
  reportDividerDotted: {
    height: 2,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'dashed',
    marginVertical: 15,
  },
  classifiedStamp: {
    position: 'absolute',
    top: 60,
    right: 20,
    borderWidth: 3,
    borderColor: '#dc2626',
    paddingHorizontal: 8,
    paddingVertical: 4,
    transform: [{ rotate: '15deg' }],
    zIndex: 5,
  },
  classifiedStampText: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  reportSection: {
    marginBottom: 12,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reportHalf: {
    flex: 1,
  },
  reportLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  reportValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },
  reportValueHighlight: {
    fontSize: 18,
    fontWeight: '950',
    color: '#b91c1c',
    fontStyle: 'italic',
  },
  actionBtnShadow: {
    backgroundColor: '#000',
    marginTop: 15,
  },
  actionBtn: {
    backgroundColor: '#b91c1c',
    borderWidth: 3,
    borderColor: '#000',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  btnIcon: {
    marginRight: 8,
  }
});
