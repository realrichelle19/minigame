import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BottomNavBar({ activeTab = 'MISSIONS', navigation }) {
  const tabs = [
    { id: 'MISSIONS', label: 'MISSIONS', icon: 'compass-outline', IconPack: Ionicons, route: 'Home' },
    { id: 'HEROES', label: 'HEROES', icon: 'shield-outline', IconPack: Ionicons, route: 'Heroes' },
    { id: 'RANKING', label: 'RANKING', icon: 'medal-outline', IconPack: MaterialCommunityIcons, route: 'Ranking' },
    { id: 'INTEL', label: 'INTEL', icon: 'information-circle-outline', IconPack: Ionicons, route: 'Rules' },
  ];

  const handlePress = (tab) => {
    if (tab.id !== activeTab && navigation) {
      navigation.navigate(tab.route);
    }
  };

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const IconComponent = tab.IconPack;
        
        return (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => handlePress(tab)}
          >
            <IconComponent 
              name={tab.icon} 
              size={24} 
              color={isActive ? '#fff' : '#333'} 
              style={styles.icon}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderTopWidth: 4,
    borderTopColor: '#000',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    backgroundColor: '#b91c1c',
    borderRightWidth: 3,
    borderRightColor: '#000',
    borderLeftWidth: 3,
    borderLeftColor: '#000',
    // offset shadow for the active tab inside the bar
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 5,
    transform: [{ translateY: -2 }, { translateX: -2 }],
    marginHorizontal: 5,
    marginVertical: 5,
  },
  icon: {
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#555',
    letterSpacing: 0.5,
  },
  activeLabel: {
    color: '#fff',
  }
});
