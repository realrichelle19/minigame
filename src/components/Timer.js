import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function Timer({ duration, onTimeUp, resetTrigger }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetTrigger]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [timeLeft, pulseAnim]);

  const getColor = () => {
    if (timeLeft > duration * 0.5) return '#4caf50'; // Green
    if (timeLeft > 5) return '#ffeb3b'; // Yellow
    return '#f44336'; // Red
  };

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[
          styles.timeText, 
          { color: getColor(), transform: [{ scale: pulseAnim }] }
        ]}
      >
        {timeLeft}s
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  timeText: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});
