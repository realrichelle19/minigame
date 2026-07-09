import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { GameContext } from '../context/GameContext';

export default function RoleSelectionScreen({ navigation }) {
  const { teamProfile, isAdmin } = useContext(GameContext);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAdmin) {
      navigation.replace('Ranking'); // Go to ranking / leaderboard
    } else if (teamProfile) {
      navigation.replace('Home');
    }
  }, [teamProfile, isAdmin]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Engaging Splash Header */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoBadge}>SRM NEEDS A SAVIOR</Text>
          <Text style={styles.logoTitle}>WEB OF RIDDLES</Text>
          <Text style={styles.logoSubtitle}>THE ULTIMATE VIGILANTE SPEEDRUN CHALLENGE</Text>
          <View style={styles.logoLine} />
        </View>

        {/* Info Box */}
        <View style={styles.infoCardShadow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              New York has been overrun by the Sinister Six. Solve the riddles, lock down threat levels, and rank your team in the speedrun leaderboard.
            </Text>
          </View>
        </View>

        {/* Vigilante Login Option */}
        <TouchableOpacity 
          style={styles.vigilanteBtnShadow} 
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <View style={styles.vigilanteBtn}>
            <Text style={styles.btnTextLarge}>PLAY AS VIGILANTE</Text>
            <Text style={styles.btnSubText}>Register team size and start speedrun</Text>
          </View>
        </TouchableOpacity>

        {/* Admin Login Option */}
        <TouchableOpacity 
          style={styles.adminBtnShadow} 
          onPress={() => navigation.navigate('AdminLogin')}
          activeOpacity={0.8}
        >
          <View style={styles.adminBtn}>
            <Text style={styles.btnTextLarge}>ADMIN PANEL</Text>
            <Text style={styles.btnSubText}>Manage teams, delete records & view leaderboard</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 35,
    width: '100%',
  },
  logoBadge: {
    backgroundColor: '#b91c1c',
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 2,
    borderColor: '#000',
    letterSpacing: 1.5,
    marginBottom: 10,
    transform: [{ rotate: '-2deg' }],
  },
  logoTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  logoSubtitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#666',
    letterSpacing: 1,
    marginTop: 5,
    textAlign: 'center',
  },
  logoLine: {
    height: 4,
    backgroundColor: '#000',
    width: '70%',
    marginTop: 20,
  },
  infoCardShadow: {
    width: '100%',
    backgroundColor: '#000',
    maxWidth: 400,
    marginBottom: 35,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  infoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    lineHeight: 20,
    textAlign: 'center',
  },
  // Vigilante Entry Button
  vigilanteBtnShadow: {
    width: '100%',
    backgroundColor: '#000',
    maxWidth: 400,
    marginBottom: 20,
  },
  vigilanteBtn: {
    backgroundColor: '#b91c1c', // Premium red
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
    alignItems: 'center',
  },
  // Admin Entry Button
  adminBtnShadow: {
    width: '100%',
    backgroundColor: '#000',
    maxWidth: 400,
    marginBottom: 10,
  },
  adminBtn: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
    alignItems: 'center',
  },
  btnTextLarge: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0.5,
    fontStyle: 'italic',
  },
  btnSubText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#555',
    marginTop: 5,
  }
});
