import React, { useState, useContext, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { GameContext } from '../context/GameContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const { teamProfile, saveTeamProfile } = useContext(GameContext);

  const [teamName, setTeamName] = useState('');
  const [leaderName, setLeaderName] = useState('');
  const [membersCount, setMembersCount] = useState('');

  // Auto-redirect if profile already registered
  useEffect(() => {
    if (teamProfile) {
      navigation.replace('Home');
    }
  }, [teamProfile]);

  const handleEnterGame = () => {
    if (!teamName.trim() || !leaderName.trim() || !membersCount.trim()) {
      alert('Please fill out all fields to register your team!');
      return;
    }

    const count = parseInt(membersCount);
    if (isNaN(count) || count <= 0) {
      alert('Please enter a valid number of members!');
      return;
    }

    saveTeamProfile({
      teamName: teamName.trim().toUpperCase(),
      leaderName: leaderName.trim(),
      membersCount: count
    });
  };

  const Wrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Wrapper behavior="padding" style={styles.flexContainer}>
        {/* Top Header Navigation Back Button */}
        <View style={styles.headerBar}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.navigate('RoleSelection')}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Logo Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.logoSubtitle}>REGISTER TEAM PROFILE</Text>
            <Text style={styles.logoTitle}>WEB OF RIDDLES</Text>
            <View style={styles.titleLine} />
          </View>

          {/* Form Card */}
          <View style={styles.formCardShadow}>
            <View style={styles.formCard}>
              
              {/* Field 1: Team Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TEAM NAME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="ENTER TEAM NAME..."
                  placeholderTextColor="#999"
                  value={teamName}
                  onChangeText={setTeamName}
                  autoCapitalize="characters"
                />
              </View>

              {/* Field 2: Leader Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>TEAM LEADER NAME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="ENTER LEADER'S NAME..."
                  placeholderTextColor="#999"
                  value={leaderName}
                  onChangeText={setLeaderName}
                />
              </View>

              {/* Field 3: Members Count */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NUMBER OF MEMBERS</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="ENTER TEAM SIZE..."
                  placeholderTextColor="#999"
                  value={membersCount}
                  onChangeText={setMembersCount}
                  keyboardType="numeric"
                />
              </View>

              {/* Enter Button */}
              <TouchableOpacity 
                style={styles.btnShadow}
                onPress={handleEnterGame}
                activeOpacity={0.8}
              >
                <View style={styles.btn}>
                  <Text style={styles.btnText}>ENTER THE GAME</Text>
                </View>
              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>
      </Wrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flexContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  logoSubtitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#b91c1c',
    letterSpacing: 1.5,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  logoTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  titleLine: {
    height: 4,
    backgroundColor: '#000',
    width: '60%',
    marginTop: 15,
  },
  formCardShadow: {
    width: '100%',
    backgroundColor: '#000',
    maxWidth: 400,
  },
  formCard: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 25,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  btnShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginTop: 10,
  },
  btn: {
    backgroundColor: '#b91c1c',
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 20,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  headerBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  backBtn: {
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  }
});
