import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="menu" size={32} color="#fff" />
      </TouchableOpacity>
      
      <Text style={styles.title}>WEB OF RIDDLES</Text>
      
      <TouchableOpacity style={styles.iconButton}>
        <Ionicons name="person-circle-outline" size={32} color="#fff" />
      </TouchableOpacity>
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
  }
});
