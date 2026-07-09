import React, { useState, useContext } from 'react';
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

export default function AdminLoginScreen({ navigation }) {
  const { saveAdminLogin } = useContext(GameContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = () => {
    if (username.trim() === 'CN' && password.trim() === 'cnthegreat') {
      saveAdminLogin(true);
      navigation.replace('Leaderboard');
    } else {
      alert('INVALID ADMIN CREDENTIALS!\nHint: Username is "CN", Password is "cnthegreat"');
    }
  };

  const Wrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Wrapper behavior="padding" style={styles.flexContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* Back button */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backText}>BACK</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.titleContainer}>
            <Text style={styles.logoSubtitle}>ADMINISTRATIVE CONSOLE</Text>
            <Text style={styles.logoTitle}>AUTHORIZATION</Text>
            <View style={styles.titleLine} />
          </View>

          {/* Login Card */}
          <View style={styles.formCardShadow}>
            <View style={styles.formCard}>
              
              {/* Username Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>USERNAME</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="CN..."
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="characters"
                />
              </View>

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="cnthegreat..."
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                      size={24} 
                      color="#000" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity 
                style={styles.btnShadow}
                onPress={handleAdminLogin}
                activeOpacity={0.8}
              >
                <View style={styles.btn}>
                  <Text style={styles.btnText}>LOG IN AS ADMIN</Text>
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    marginLeft: 5,
    fontStyle: 'italic',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    marginTop: 40,
  },
  logoSubtitle: {
    fontSize: 12,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 15,
  },
  btnShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginTop: 10,
  },
  btn: {
    backgroundColor: '#000', // Admin gets solid black button
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    fontStyle: 'italic',
    letterSpacing: 1,
  }
});
