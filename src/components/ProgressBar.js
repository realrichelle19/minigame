import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProgressBar({ currentRound, totalRounds }) {
  const percentage = (currentRound / totalRounds) * 100;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Progress: {currentRound} / {totalRounds}</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  text: {
    color: '#bbb',
    fontSize: 12,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  barBackground: {
    height: 10,
    backgroundColor: '#333',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#366ce2', // Spider-Man Blue
    borderRadius: 5,
  }
});
