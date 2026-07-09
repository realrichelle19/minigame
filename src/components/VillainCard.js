import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function VillainCard({ villain }) {
  const slideAnim = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset animations
    slideAnim.setValue(100);
    fadeAnim.setValue(0);

    // Run animations on mount and when villain changes
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, [villain, slideAnim, fadeAnim]);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }]}>
      <Text style={styles.villainName}>{villain.name}</Text>
      <Text style={styles.difficulty}>Difficulty: {villain.difficulty}</Text>
      <View style={styles.dialogueBox}>
        <Text style={styles.dialogueText}>"{villain.dialogue}"</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignItems: 'center',
    marginVertical: 15,
    borderWidth: 2,
    borderColor: '#e23636',
    shadowColor: '#e23636',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  villainName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 5,
  },
  difficulty: {
    color: '#ffc107',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dialogueBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  dialogueText: {
    color: '#ddd',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  }
});
