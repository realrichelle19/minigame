import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

export default function GameScreen({ navigation }) {
  const { 
    currentVillain, 
    currentRoundIndex, 
    score, 
    totalRounds, 
    answerQuestion, 
    failRound,
    isGameOver,
    gameWon
  } = useContext(GameContext);

  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(currentVillain ? currentVillain.timer : 60);

  useEffect(() => {
    if (currentVillain) {
      setTimeLeft(currentVillain.timer);
    }
  }, [currentVillain]);

  useEffect(() => {
    if (isGameOver) {
      if (gameWon) {
        navigation.replace('Victory');
      } else {
        navigation.replace('Home');
      }
      return;
    }

    if (timeLeft <= 0 && currentVillain) {
      failRound();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isGameOver, gameWon, currentVillain]);

  const handleSubmit = () => {
    const isCorrect = answer.toLowerCase().trim() === currentVillain.riddle.answer.toLowerCase();
    if (isCorrect) {
      setAnswer('');
      answerQuestion(true);
    } else {
      alert('Wrong answer! Try again!');
    }
  };

  if (isGameOver || !currentVillain) return null;

  const segments = Array.from({ length: 6 }).map((_, i) => i < 5);
  const potentialPenalty = Math.floor(score / 2);

  const Wrapper = Platform.OS === 'web' ? View : KeyboardAvoidingView;
  const wrapperProps = Platform.OS === 'web' ? {} : { behavior: Platform.OS === 'ios' ? 'padding' : 'height' };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <Wrapper {...wrapperProps} style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          
          {/* Main Villain Card */}
          <View style={styles.cardShadow}>
            <View style={styles.card}>
              
              <View style={styles.cardHeader}>
                <Text style={styles.villainName}>{currentVillain.name.toUpperCase()}</Text>
                <View style={styles.villainBadge}>
                  <Text style={styles.villainBadgeText}>VILLAIN</Text>
                </View>
              </View>

              {/* Image Placeholder */}
              <View style={styles.imagePlaceholder}>
                 {/* Replace with actual image later */}
              </View>

              {/* Threat Level */}
              <View style={styles.threatContainer}>
                <View style={styles.threatHeader}>
                  <Text style={styles.threatLabel}>THREAT LEVEL:</Text>
                  <Text style={styles.threatValue}>EXTREME</Text>
                </View>
                <View style={styles.threatBar}>
                  {segments.map((isFilled, idx) => (
                    <View key={idx} style={[styles.threatSegment, isFilled && styles.threatSegmentFilled]} />
                  ))}
                </View>
              </View>

            </View>
          </View>

          {/* Mission Progress */}
          <View style={styles.progressShadow}>
            <View style={styles.progressCard}>
              <Text style={styles.progressLabel}>MISSION PROGRESS</Text>
              <Text style={styles.progressValue}>ROUND {currentRoundIndex + 1} / {totalRounds}</Text>
            </View>
          </View>

          {/* Timer */}
          <View style={styles.timerContainer}>
            <View style={styles.timerShadow}>
              <View style={styles.timerCircle}>
                <Text style={styles.timerLabel}>SPIDEY-SENSE</Text>
                <Text style={styles.timerValue}>{timeLeft}</Text>
                <Text style={styles.timerSubLabel}>SEC LEFT</Text>
              </View>
            </View>
          </View>

          {/* Riddle Speech Bubble */}
          <View style={styles.riddleBubbleShadow}>
            <View style={styles.riddleBubble}>
              {/* Bubble Pointer */}
              <View style={styles.bubblePointer} />
              
              <Text style={styles.riddleText}>"{currentVillain.riddle.question}"</Text>
              
              <Text style={styles.inputLabel}>YOUR RESPONSE:</Text>
              
              <TextInput
                style={styles.input}
                placeholder="TYPE YOUR ANSWER..."
                placeholderTextColor="#999"
                value={answer}
                onChangeText={setAnswer}
                autoCapitalize="none"
              />
              
              <TouchableOpacity 
                style={styles.thwipBtnShadow}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <View style={styles.thwipBtn}>
                  <Text style={styles.thwipBtnText}>THWIP!</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stat Boxes */}
          <View style={styles.statsRow}>
            <View style={[styles.statBoxShadow, { flex: 1, marginRight: 15 }]}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>CURRENT POINTS</Text>
                <Text style={styles.statBoxPoints}>{score}</Text>
              </View>
            </View>
            
            <View style={[styles.statBoxShadow, { flex: 1 }]}>
              <View style={styles.statBox}>
                <Text style={styles.statBoxLabel}>POTENTIAL PENALTY</Text>
                <Text style={styles.statBoxPenalty}>-{potentialPenalty}</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </Wrapper>
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
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  cardShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  villainName: {
    color: '#b91c1c',
    fontSize: 28,
    fontWeight: '900',
    flex: 1,
    letterSpacing: 1,
  },
  villainBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    transform: [{ skewX: '-10deg' }],
  },
  villainBadgeText: {
    color: '#fff',
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 14,
  },
  imagePlaceholder: {
    width: '100%',
    height: 130,
    backgroundColor: '#a3a3a3', // Grey gradient mock
    borderWidth: 4,
    borderColor: '#000',
    marginBottom: 15,
  },
  threatContainer: {
    marginTop: 5,
  },
  threatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  threatLabel: {
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },
  threatValue: {
    color: '#b91c1c',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  threatBar: {
    flexDirection: 'row',
    borderWidth: 3,
    borderColor: '#000',
    padding: 2,
    justifyContent: 'space-between',
  },
  threatSegment: {
    flex: 1,
    height: 10,
    backgroundColor: '#ddd',
    marginHorizontal: 1,
  },
  threatSegmentFilled: {
    backgroundColor: '#b91c1c',
  },
  progressShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 30,
  },
  progressCard: {
    width: '100%',
    backgroundColor: '#8b8bdf',
    borderWidth: 4,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    color: '#333',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
  progressValue: {
    color: '#333',
    fontWeight: '900',
    fontSize: 28,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  timerShadow: {
    backgroundColor: '#000',
    borderRadius: 75,
  },
  timerCircle: {
    width: 130,
    height: 130,
    backgroundColor: '#fff',
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#000',
    borderStyle: 'dashed',
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerLabel: {
    color: '#b91c1c',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  timerValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000',
    lineHeight: 50,
  },
  timerSubLabel: {
    color: '#b91c1c',
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Riddle Speech Bubble
  riddleBubbleShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 25,
  },
  riddleBubble: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 25,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  bubblePointer: {
    position: 'absolute',
    top: -12,
    left: 40,
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#000',
    transform: [{ rotate: '45deg' }],
  },
  riddleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 0,
    lineHeight: 28,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    width: '100%',
    padding: 15,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  thwipBtnShadow: {
    width: '100%',
    backgroundColor: '#000',
  },
  thwipBtn: {
    backgroundColor: '#b91c1c',
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
  },
  thwipBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 24,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statBoxShadow: {
    backgroundColor: '#000',
  },
  statBox: {
    backgroundColor: '#e5e7eb', // Light grey
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBoxLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  statBoxPoints: {
    fontSize: 24,
    fontWeight: '900',
    color: '#3b82f6', // Blue
  },
  statBoxPenalty: {
    fontSize: 24,
    fontWeight: '900',
    color: '#b91c1c', // Red
  }
});
