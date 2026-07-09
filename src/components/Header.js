import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GameContext } from '../context/GameContext';

export default function Header() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const navigation = useNavigation();

  const { teamProfile, logoutProfile, isAdmin } = useContext(GameContext);

  const handleNavigate = (screenName) => {
    setMenuVisible(false);
    navigation.navigate(screenName);
  };

  const handleLogout = () => {
    setProfileVisible(false);
    logoutProfile();
    navigation.replace('RoleSelection');
  };

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={() => setMenuVisible(true)}>
        <Ionicons name="menu" size={32} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.title}>WEB OF RIDDLES</Text>
      
      <TouchableOpacity style={styles.iconButton} onPress={() => setProfileVisible(true)}>
        <Ionicons name="person-circle-outline" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Side Drawer Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <Pressable>
            <View style={styles.drawerContainer}>
                
                <View style={styles.drawerHeader}>
                  <Text style={styles.drawerTitle}>MENU</Text>
                  <TouchableOpacity onPress={() => setMenuVisible(false)}>
                    <Ionicons name="close" size={32} color="#000" />
                  </TouchableOpacity>
                </View>

                <View style={styles.drawerDivider} />

                {/* Navigation Items */}
                <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigate('Home')}>
                  <Ionicons name="home" size={24} color="#b91c1c" />
                  <Text style={styles.drawerItemText}>HOME</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigate('Investigations')}>
                  <Ionicons name="shield-checkmark" size={24} color="#b91c1c" />
                  <Text style={styles.drawerItemText}>INVESTIGATIONS</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigate('Heroes')}>
                  <Ionicons name="people" size={24} color="#b91c1c" />
                  <Text style={styles.drawerItemText}>VIGILANTE ROSTER</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigate('Ranking')}>
                  <Ionicons name="ribbon" size={24} color="#b91c1c" />
                  <Text style={styles.drawerItemText}>RANKING</Text>
                </TouchableOpacity>

                {isAdmin && (
                  <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigate('Leaderboard')}>
                    <Ionicons name="trophy" size={24} color="#b91c1c" />
                    <Text style={styles.drawerItemText}>LEADERBOARD</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigate('Rules')}>
                  <Ionicons name="document-text" size={24} color="#b91c1c" />
                  <Text style={styles.drawerItemText}>GAME RULES</Text>
                </TouchableOpacity>

              </View>
            </Pressable>
          </Pressable>
      </Modal>

      {/* Profile Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileVisible}
        onRequestClose={() => setProfileVisible(false)}
      >
        <Pressable style={styles.modalOverlayCenter} onPress={() => setProfileVisible(false)}>
          <Pressable>
            <View style={styles.profileCardShadow}>
              <View style={styles.profileCard}>
                  
                  {/* Header */}
                  <View style={styles.profileHeader}>
                    <Text style={styles.profileTitle}>TEAM PROFILE</Text>
                    <TouchableOpacity onPress={() => setProfileVisible(false)}>
                      <Ionicons name="close" size={32} color="#000" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.drawerDivider} />

                  {/* Body Info */}
                  {isAdmin ? (
                    <>
                      <View style={styles.infoGroup}>
                        <Text style={styles.infoLabel}>ROLE</Text>
                        <Text style={styles.infoValue}>SYSTEM ADMIN</Text>
                      </View>

                      <View style={styles.infoGroup}>
                        <Text style={styles.infoLabel}>OPERATOR ID</Text>
                        <Text style={styles.infoValue}>CN</Text>
                      </View>

                      <View style={styles.infoGroup}>
                        <Text style={styles.infoLabel}>DELETION PRIVILEGES</Text>
                        <Text style={styles.infoValue}>GRANTED</Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.infoGroup}>
                        <Text style={styles.infoLabel}>ACTIVE TEAM</Text>
                        <Text style={styles.infoValue}>{teamProfile?.teamName || 'N/A'}</Text>
                      </View>

                      <View style={styles.infoGroup}>
                        <Text style={styles.infoLabel}>TEAM LEADER</Text>
                        <Text style={styles.infoValue}>{teamProfile?.leaderName || 'N/A'}</Text>
                      </View>

                      <View style={styles.infoGroup}>
                        <Text style={styles.infoLabel}>TEAM SIZE</Text>
                        <Text style={styles.infoValue}>{teamProfile?.membersCount || '0'} MEMBER(S)</Text>
                      </View>
                    </>
                  )}

                  {/* Logout Button */}
                  <TouchableOpacity 
                    style={styles.logoutBtnShadow}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                  >
                    <View style={styles.logoutBtn}>
                      <Text style={styles.logoutBtnText}>LOGOUT / CHANGE TEAM</Text>
                    </View>
                  </TouchableOpacity>

                </View>
              </View>
            </Pressable>
          </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#b91c1c', // Deep red
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 4,
    borderBottomColor: '#000',
    zIndex: 10,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  iconButton: {
    padding: 5,
  },
  // Modal Drawer Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    width: '75%',
    height: '100%',
    backgroundColor: '#fff',
    borderRightWidth: 5,
    borderRightColor: '#000',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  drawerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  drawerDivider: {
    height: 4,
    backgroundColor: '#000',
    marginVertical: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderWidth: 3,
    borderColor: '#000',
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    marginLeft: 15,
    letterSpacing: 0.5,
  },
  // Profile Modal Overlay Centered
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileCardShadow: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#000',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 25,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  infoGroup: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#b91c1c',
  },
  logoutBtnShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginTop: 15,
  },
  logoutBtn: {
    backgroundColor: '#dc2626', // Red
    borderWidth: 3,
    borderColor: '#000',
    padding: 12,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  }
});
