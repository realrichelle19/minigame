import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { missions } from '../data/riddles';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentMissionId, setCurrentMissionId] = useState('toxic_spill');
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [debt, setDebt] = useState(0);
  const [victimsSaved, setVictimsSaved] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  const currentMission = missions[currentMissionId];
  const currentVillain = currentMission ? {
    name: currentMission.villainName,
    threatLevel: currentMission.threatLevel,
    timer: currentMission.timer,
    riddle: currentMission.riddles[currentRiddleIndex]
  } : null;

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
      const mission = missions[currentMissionId];
      const currentRiddle = mission.riddles[currentRiddleIndex];
      const pointsEarned = currentRiddle.points;
      const newScore = score + pointsEarned;
      setScore(newScore);

      // Save 3 victims on easy level, 5 on boss, etc.
      const victimsPerCorrect = currentMissionId === 'rooftop_witness' ? 4 : 2;
      setVictimsSaved(victimsSaved + victimsPerCorrect);
      
      if (currentRiddleIndex + 1 < mission.riddles.length) {
        setCurrentRiddleIndex(currentRiddleIndex + 1);
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
    if (['rooftop_witness', 'vault_breaker', 'toxic_spill'].includes(currentMissionId)) {
      // "restart the round for him" (reset current level progress, reset score, reload timer)
      setCurrentRiddleIndex(0);
      setScore(0);
      setResetTrigger(prev => prev + 1); // trigger timer reset in UI
    } else {
      // Standard penalty/game over rules for other levels
      const debtAdded = Math.floor(score / 2);
      const newDebt = debt + debtAdded;
      setDebt(newDebt);
      saveStats(newDebt);
      
      setCurrentRiddleIndex(0);
      setScore(0);
      setVictimsSaved(0);
      setIsGameOver(true);
      setGameWon(false);
    }
  };

  const restartGame = (missionId = 'toxic_spill') => {
    setCurrentMissionId(missionId);
    setCurrentRiddleIndex(0);
    setScore(0);
    setVictimsSaved(0);
    setIsGameOver(false);
    setGameWon(false);
    setResetTrigger(prev => prev + 1);
  };

  const saveFinalStats = async (finalScore) => {
    try {
      const stats = await AsyncStorage.getItem('stats');
      const parsedStats = stats ? JSON.parse(stats) : { gamesPlayed: 0, gamesWon: 0, highestScore: 0, totalVictimsSaved: 0, totalVillainsDefeated: 0 };
      
      parsedStats.gamesPlayed += 1;
      parsedStats.gamesWon += 1;
      parsedStats.highestScore = Math.max(parsedStats.highestScore, finalScore);
      parsedStats.totalVictimsSaved += victimsSaved + (currentMissionId === 'rooftop_witness' ? 4 : 2);
      parsedStats.totalVillainsDefeated += 1;
      
      await AsyncStorage.setItem('stats', JSON.stringify(parsedStats));
    } catch (e) {
      console.error('Failed to save final stats');
    }
  };

  return (
    <GameContext.Provider value={{
      currentVillain,
      currentMissionId,
      currentRoundIndex: currentRiddleIndex,
      score,
      debt,
      victimsSaved,
      isGameOver,
      gameWon,
      answerQuestion,
      failRound,
      restartGame,
      resetTrigger,
      totalRounds: currentMission ? currentMission.riddles.length : 1
    }}>
      {children}
    </GameContext.Provider>
  );
};
