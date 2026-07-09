import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

const heroes = [
  { id: 1, name: 'PETER PARKER', alias: 'SPIDER-MAN', status: 'ACTIVE', color: '#b91c1c' },
  { id: 2, name: 'MILES MORALES', alias: 'SPIDER-MAN', status: 'ACTIVE', color: '#000' },
  { id: 3, name: 'GWEN STACY', alias: 'SPIDER-GWEN', status: 'ACTIVE', color: '#db2777' },
  { id: 4, name: 'MIGUEL O\'HARA', alias: 'SPIDER-MAN 2099', status: 'OFFLINE', color: '#1d4ed8' },
];

export default function HeroesScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.pageTitle}>VIGILANTE ROSTER</Text>
        
        {heroes.map(hero => (
          <View key={hero.id} style={styles.cardShadow}>
            <View style={styles.card}>
              <View style={[styles.heroColorBar, { backgroundColor: hero.color }]} />
              <View style={styles.cardContent}>
                <Text style={styles.heroName}>{hero.name}</Text>
                <Text style={styles.heroAlias}>{hero.alias}</Text>
                
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{hero.status}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

      </ScrollView>
      <BottomNavBar activeTab="HEROES" navigation={navigation} />
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
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    marginBottom: 20,
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  cardShadow: {
    width: '100%',
    backgroundColor: '#000',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
    flexDirection: 'row',
    transform: [{ translateX: -4 }, { translateY: -4 }],
  },
  heroColorBar: {
    width: 20,
    borderRightWidth: 4,
    borderRightColor: '#000',
  },
  cardContent: {
    padding: 15,
    flex: 1,
  },
  heroName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  heroAlias: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    marginBottom: 10,
    letterSpacing: 1,
  },
  statusBadge: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    transform: [{ skewX: '-10deg' }],
  },
  statusText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
    fontStyle: 'italic',
  }
});
