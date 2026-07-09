import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { GameContext } from '../context/GameContext';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';
import { Ionicons } from '@expo/vector-icons';

export default function RatingsScreen({ navigation }) {
  const { submitFeedback, teamProfile } = useContext(GameContext);

  const [overallExperience, setOverallExperience] = useState(5);
  const [eventContent, setEventContent] = useState(5);
  const [logistics, setLogistics] = useState(5);
  const [volunteers, setVolunteers] = useState(5);
  const [futureInterests, setFutureInterests] = useState(5);

  const categories = [
    { label: 'OVERALL EXPERIENCE', value: overallExperience, setter: setOverallExperience },
    { label: 'EVENT CONTENT', value: eventContent, setter: setEventContent },
    { label: 'LOGISTICS', value: logistics, setter: setLogistics },
    { label: 'VOLUNTEERS', value: volunteers, setter: setVolunteers },
    { label: 'FUTURE INTERESTS', value: futureInterests, setter: setFutureInterests },
  ];

  const handleSubmit = async () => {
    await submitFeedback({
      overallExperience,
      eventContent,
      logistics,
      volunteers,
      futureInterests
    });
    alert('THANK YOU FOR YOUR FEEDBACK!');
    navigation.replace('Ranking');
  };

  const renderStarBar = (currentValue, setter) => {
    return (
      <View style={styles.starRow}>
        {Array.from({ length: 5 }).map((_, index) => {
          const starVal = index + 1;
          const isFilled = starVal <= currentValue;
          return (
            <TouchableOpacity 
              key={starVal} 
              onPress={() => setter(starVal)}
              activeOpacity={0.7}
              style={styles.starTouch}
            >
              <Ionicons 
                name={isFilled ? 'star' : 'star-outline'} 
                size={32} 
                color={isFilled ? '#facc15' : '#000'} 
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Title Card */}
        <View style={styles.titleCardShadow}>
          <View style={styles.titleCard}>
            <Text style={styles.cardBadge}>RATE THE GAME</Text>
            <Text style={styles.cardTitle}>CAMPUS QUEST '26</Text>
            <Text style={styles.cardSubtitle}>
              Help us calibrate future modules by registering your scores below.
            </Text>
          </View>
        </View>

        {/* Vigilante details overview */}
        <View style={styles.vigilanteRow}>
          <Text style={styles.vigilanteLabel}>VIGILANTE TEAM: </Text>
          <Text style={styles.vigilanteValue}>{teamProfile?.teamName || 'ANONYMOUS'}</Text>
        </View>

        {/* Rating Category Blocks */}
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.ratingBoxShadow}>
            <View style={styles.ratingBox}>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              {renderStarBar(cat.value, cat.setter)}
            </View>
          </View>
        ))}

        {/* Submit button */}
        <TouchableOpacity 
          style={styles.submitBtnShadow} 
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <View style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>SUBMIT RATINGS</Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
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
    padding: 20,
    backgroundColor: '#f5f5f5',
    minHeight: '100%',
    paddingBottom: 40,
    alignItems: 'center',
  },
  // Title card
  titleCardShadow: {
    width: '100%',
    backgroundColor: '#000',
    maxWidth: 400,
    marginBottom: 20,
  },
  titleCard: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    padding: 20,
    transform: [{ translateX: -6 }, { translateY: -6 }],
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    color: '#fff',
    fontWeight: '900',
    fontSize: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#b91c1c',
    letterSpacing: 0.5,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    lineHeight: 16,
  },
  // Vigilante subtitle
  vigilanteRow: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  vigilanteLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  vigilanteValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
  },
  // Category rating box
  ratingBoxShadow: {
    width: '100%',
    backgroundColor: '#000',
    maxWidth: 400,
    marginBottom: 15,
  },
  ratingBox: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  starRow: {
    flexDirection: 'row',
  },
  starTouch: {
    marginRight: 10,
  },
  // Submit Button
  submitBtnShadow: {
    width: '100%',
    backgroundColor: '#000',
    maxWidth: 400,
    marginTop: 15,
  },
  submitBtn: {
    backgroundColor: '#b91c1c',
    borderWidth: 3,
    borderColor: '#000',
    padding: 15,
    transform: [{ translateX: -4 }, { translateY: -4 }],
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 20,
    fontStyle: 'italic',
    letterSpacing: 1,
  }
});
