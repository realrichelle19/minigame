import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { villains } from '../data/riddles';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [debt, setDebt] = useState(0);
  const [victimsSaved, setVictimsSaved] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const currentVillain = villains[currentRoundIndex];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const savedDebt = await AsyncStorage.getItem('debt');
      if (savedDebt) setDebt(parseInt(savedDebt));
    } catch (e) {
      console.error('Failed to load debt from storage');
    }
  };

  const saveStats = async (newDebt) => {
    try {
      await AsyncStorage.setItem('debt', newDebt.toString());
    } catch (e) {
      console.error('Failed to save debt');
    }
  };

  const answerQuestion = (isCorrect) => {
    if (isCorrect) {
      const pointsEarned = currentVillain.points;
      const newScore = score + pointsEarned;
      setScore(newScore);
      setVictimsSaved(victimsSaved + currentVillain.victimsSaved);
      
      if (currentRoundIndex + 1 < villains.length) {
        setCurrentRoundIndex(currentRoundIndex + 1);
      } else {
        setGameWon(true);
        setIsGameOver(true);
        saveFinalStats(newScore);
      }
      return true;
    }
    return false;
  };

  const failRound = () => {
    // Timer expired or failed heavily
    const debtAdded = Math.floor(score / 2);
    const newDebt = debt + debtAdded;
    setDebt(newDebt);
    saveStats(newDebt);
    
    // Reset round progress but keep debt
    setCurrentRoundIndex(0);
    setScore(0);
    setVictimsSaved(0);
    setIsGameOver(true);
    setGameWon(false);
  };

  const restartGame = () => {
    setCurrentRoundIndex(0);
    setScore(0);
    setVictimsSaved(0);
    setIsGameOver(false);
    setGameWon(false);
  };

  const saveFinalStats = async (finalScore) => {
    try {
      const stats = await AsyncStorage.getItem('stats');
      const parsedStats = stats ? JSON.parse(stats) : { gamesPlayed: 0, gamesWon: 0, highestScore: 0, totalVictimsSaved: 0, totalVillainsDefeated: 0 };
      
      parsedStats.gamesPlayed += 1;
      parsedStats.gamesWon += 1;
      parsedStats.highestScore = Math.max(parsedStats.highestScore, finalScore);
      parsedStats.totalVictimsSaved += victimsSaved + currentVillain.victimsSaved;
      parsedStats.totalVillainsDefeated += villains.length;
      
      await AsyncStorage.setItem('stats', JSON.stringify(parsedStats));
    } catch (e) {
      console.error('Failed to save final stats');
    }
  };

  return (
    <GameContext.Provider value={{
      currentVillain,
      currentRoundIndex,
      score,
      debt,
      victimsSaved,
      isGameOver,
      gameWon,
      answerQuestion,
      failRound,
      restartGame,
      totalRounds: villains.length
    }}>
      {children}
    </GameContext.Provider>
  );
};
