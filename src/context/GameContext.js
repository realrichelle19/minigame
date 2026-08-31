import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { missions } from '../data/riddles';
import { supabase } from '../lib/supabase';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentMissionId, setCurrentMissionId] = useState('toxic_spill');
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [solvedRiddleIndices, setSolvedRiddleIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [victimsSaved, setVictimsSaved] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [teamName, setTeamNameState] = useState('');
  const [teams, setTeams] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameElapsedTime, setGameElapsedTime] = useState(null);
  const [teamProfile, setTeamProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState('CN');

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
      const savedCompleted = await AsyncStorage.getItem('completedMissions');
      let loadedCompleted = [];
      if (savedCompleted) {
        loadedCompleted = JSON.parse(savedCompleted);
        setCompletedMissions(loadedCompleted);
      }

      // Initialize score based on locked completed missions milestone
      const numLocked = loadedCompleted.length;
      if (numLocked === 3) setScore(1600);
      else if (numLocked === 2) setScore(850);
      else if (numLocked === 1) setScore(400);
      else setScore(0);

      const savedTeam = await AsyncStorage.getItem('teamName');
      if (savedTeam) setTeamNameState(savedTeam);

      const savedTeams = await AsyncStorage.getItem('registered_teams');
      if (savedTeams) setTeams(JSON.parse(savedTeams));

      const savedStartTime = await AsyncStorage.getItem('game_start_time');
      if (savedStartTime) setGameStartTime(parseInt(savedStartTime));

      const savedElapsedTime = await AsyncStorage.getItem('game_elapsed_time');
      if (savedElapsedTime) setGameElapsedTime(parseInt(savedElapsedTime));

      const savedProfile = await AsyncStorage.getItem('team_profile');
      if (savedProfile) setTeamProfile(JSON.parse(savedProfile));

      const savedAdmin = await AsyncStorage.getItem('is_admin');
      if (savedAdmin) setIsAdmin(JSON.parse(savedAdmin));

      const savedAdminName = await AsyncStorage.getItem('admin_name');
      if (savedAdminName) setAdminName(savedAdminName);
    } catch (e) {
      console.error('Failed to load stats from storage');
    }
  };

  // Safe Supabase sync helper (fails silently if tables do not exist yet)
  const syncToSupabase = async (updatedStats) => {
    try {
      let profileId = await AsyncStorage.getItem('supabase_profile_id');
      if (!profileId) {
        profileId = 'player_' + Math.random().toString(36).substring(2, 15);
        await AsyncStorage.setItem('supabase_profile_id', profileId);
      }

      await supabase
        .from('game_stats')
        .upsert({ 
          id: profileId, 
          score: updatedStats.score || 0,
          completed_missions: updatedStats.completedMissions || [],
          team_name: updatedStats.teamName || '',
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      // Fail silently to keep game offline-first playable
      console.log('Supabase sync log (offline/pending):', err.message);
    }
  };

  // Sync teams list to Supabase
  const syncTeamsToSupabase = async (teamsList) => {
    try {
      let profileId = await AsyncStorage.getItem('supabase_profile_id');
      if (!profileId) {
        profileId = 'player_' + Math.random().toString(36).substring(2, 15);
        await AsyncStorage.setItem('supabase_profile_id', profileId);
      }

      await supabase
        .from('registered_teams')
        .upsert({ 
          profile_id: profileId, 
          teams: teamsList,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.log('Supabase sync teams log (offline/pending):', err.message);
    }
  };

  const updateTeamName = async (newTeamName) => {
    try {
      const formattedName = newTeamName.toUpperCase();
      setTeamNameState(formattedName);
      await AsyncStorage.setItem('teamName', formattedName);
      
      // Sync to Supabase
      syncToSupabase({
        score,
        completedMissions,
        teamName: formattedName
      });
    } catch (e) {
      console.error('Failed to save team name');
    }
  };

  const addTeam = async (name) => {
    try {
      const formattedName = name.trim().toUpperCase();
      if (teams.some(t => t.name === formattedName)) return;

      const newTeam = {
        id: 'team_' + Date.now().toString(36),
        name: formattedName,
        isCompleted: false,
        clearTime: null,
        gamesPlayed: 1,
        attempts: []
      };
      const updatedTeams = [...teams, newTeam];
      setTeams(updatedTeams);
      await AsyncStorage.setItem('registered_teams', JSON.stringify(updatedTeams));
      syncTeamsToSupabase(updatedTeams);
    } catch (e) {
      console.error('Failed to add team');
    }
  };

  const deleteTeam = async (id) => {
    try {
      const updatedTeams = teams.filter(t => t.id !== id);
      setTeams(updatedTeams);
      await AsyncStorage.setItem('registered_teams', JSON.stringify(updatedTeams));
      syncTeamsToSupabase(updatedTeams);

      // Unlock all rounds (clear completedMissions, reset scores and speedrun timer)!
      setCompletedMissions([]);
      await AsyncStorage.setItem('completedMissions', JSON.stringify([]));
      setScore(0);
      setVictimsSaved(0);
      setIsGameOver(false);
      setGameWon(false);
      setResetTrigger(prev => prev + 1);
      
      setGameStartTime(null);
      setGameElapsedTime(null);
      await AsyncStorage.removeItem('game_start_time');
      await AsyncStorage.removeItem('game_elapsed_time');

      syncToSupabase({
        score: 0,
        completedMissions: [],
        teamName: ''
      });
    } catch (e) {
      console.error('Failed to delete team');
    }
  };

  const markTeamCompleted = async (id) => {
    try {
      const updatedTeams = teams.map(t => t.id === id ? { ...t, isCompleted: true } : t);
      setTeams(updatedTeams);
      await AsyncStorage.setItem('registered_teams', JSON.stringify(updatedTeams));
      syncTeamsToSupabase(updatedTeams);
    } catch (e) {
      console.error('Failed to mark team completed');
    }
  };

  const nextQuestion = () => {
    if (currentMission && currentMission.riddles && currentMission.riddles.length > 0) {
      setCurrentRiddleIndex((prevIndex) => (prevIndex + 1) % currentMission.riddles.length);
    }
  };

  const getNextUnsolvedIndex = (fromIndex, solvedArr) => {
    const total = currentMission?.riddles?.length || 1;
    for (let i = 1; i <= total; i++) {
      const nextIdx = (fromIndex + i) % total;
      if (!solvedArr.includes(nextIdx)) {
        return nextIdx;
      }
    }
    return fromIndex;
  };

  const answerQuestion = (isCorrect) => {
    if (isCorrect) {
      const mission = missions[currentMissionId];
      
      let newSolved = solvedRiddleIndices;

      if (!solvedRiddleIndices.includes(currentRiddleIndex)) {
        newSolved = [...solvedRiddleIndices, currentRiddleIndex];
        setSolvedRiddleIndices(newSolved);

        const victimsPerCorrect = currentMissionId === 'rooftop_witness' ? 4 : 2;
        setVictimsSaved(prev => prev + victimsPerCorrect);
      }

      // Lock/complete mission ONLY when ALL questions in the current mission are answered correctly
      if (newSolved.length >= mission.riddles.length) {
        setGameWon(true);
        setIsGameOver(true);
        saveFinalStats();
      } else {
        // Otherwise, move to the next unsolved question and keep timer & mission active!
        const nextUnsolved = getNextUnsolvedIndex(currentRiddleIndex, newSolved);
        setCurrentRiddleIndex(nextUnsolved);
      }
      return true;
    }
    return false;
  };

  const failRound = () => {
    const numLocked = completedMissions.length;
    const lockedScore = numLocked === 3 ? 1600 : numLocked === 2 ? 850 : numLocked === 1 ? 400 : 0;

    if (['rooftop_witness', 'vault_breaker', 'toxic_spill'].includes(currentMissionId)) {
      // Restart the round
      setCurrentRiddleIndex(0);
      setSolvedRiddleIndices([]);
      setScore(lockedScore);
      setResetTrigger(prev => prev + 1);
    } else {
      // Standard game over
      setCurrentRiddleIndex(0);
      setSolvedRiddleIndices([]);
      setScore(lockedScore);
      setVictimsSaved(0);
      setIsGameOver(true);
      setGameWon(false);
      
      // Sync failure stats to Supabase
      syncToSupabase({
        score: lockedScore,
        completedMissions,
        teamName
      });
    }
  };

  const restartGame = async (missionId = 'toxic_spill') => {
    setCurrentMissionId(missionId);
    setCurrentRiddleIndex(0);
    setSolvedRiddleIndices([]);
    
    const numLocked = completedMissions.length;
    const lockedScore = numLocked === 3 ? 1600 : numLocked === 2 ? 850 : numLocked === 1 ? 400 : 0;
    setScore(lockedScore);
    
    setVictimsSaved(0);
    setIsGameOver(false);
    setGameWon(false);
    setResetTrigger(prev => prev + 1);
    
    await AsyncStorage.removeItem('admin_run_id');

    // If starting the 1st round (rooftop_witness), start the timer!
    if (missionId === 'rooftop_witness') {
      const startTime = Date.now();
      setGameStartTime(startTime);
      setGameElapsedTime(null);
      await AsyncStorage.setItem('game_start_time', startTime.toString());
      await AsyncStorage.removeItem('game_elapsed_time');
    }
  };

  const promoteToNextLevel = async () => {
    setCompletedMissions([]);
    await AsyncStorage.setItem('completedMissions', JSON.stringify([]));
    setScore(0);
    setVictimsSaved(0);
    setIsGameOver(false);
    setGameWon(false);
    setResetTrigger(prev => prev + 1);
    
    // Reset timer
    setGameStartTime(null);
    setGameElapsedTime(null);
    await AsyncStorage.removeItem('game_start_time');
    await AsyncStorage.removeItem('game_elapsed_time');
    await AsyncStorage.removeItem('admin_run_id');

    // Increment gamesPlayed for the active team
    if (teamProfile) {
      const updatedTeams = teams.map(t => {
        if (t.name === teamProfile.teamName) {
          return { ...t, gamesPlayed: (t.gamesPlayed || 1) + 1 };
        }
        return t;
      });
      setTeams(updatedTeams);
      await AsyncStorage.setItem('registered_teams', JSON.stringify(updatedTeams));
      syncTeamsToSupabase(updatedTeams);
    }

    // Sync to Supabase
    syncToSupabase({
      score: 0,
      completedMissions: [],
      teamName
    });
  };

  const saveTeamProfile = async (profile) => {
    try {
      setTeamProfile(profile);
      await AsyncStorage.setItem('team_profile', JSON.stringify(profile));
      
      // Auto-register team name in our teams list too
      addTeam(profile.teamName);

      // Sync profile info to Supabase
      let profileId = await AsyncStorage.getItem('supabase_profile_id');
      if (!profileId) {
        profileId = 'player_' + Math.random().toString(36).substring(2, 15);
        await AsyncStorage.setItem('supabase_profile_id', profileId);
      }
      await supabase
        .from('team_profiles')
        .upsert({
          profile_id: profileId,
          team_name: profile.teamName,
          leader_name: profile.leaderName,
          members_count: parseInt(profile.membersCount) || 0,
          updated_at: new Date().toISOString()
        });
    } catch (e) {
      console.error('Failed to save team profile', e.message);
    }
  };

  const logoutProfile = async () => {
    try {
      setTeamProfile(null);
      setIsAdmin(false);
      await AsyncStorage.removeItem('team_profile');
      await AsyncStorage.removeItem('is_admin');
      await AsyncStorage.removeItem('admin_run_id');
      await promoteToNextLevel();
    } catch (e) {
      console.error('Failed to logout');
    }
  };

  const saveAdminLogin = async (adminStatus) => {
    try {
      setIsAdmin(adminStatus);
      await AsyncStorage.setItem('is_admin', JSON.stringify(adminStatus));
    } catch (e) {
      console.error('Failed to save admin status');
    }
  };

  const saveAdminName = async (name) => {
    try {
      setAdminName(name);
      await AsyncStorage.setItem('admin_name', name);
    } catch (e) {
      console.error('Failed to save admin name');
    }
  };



  const saveFinalStats = async () => {
    try {
      const newCompleted = [...completedMissions];
      if (!newCompleted.includes(currentMissionId)) {
        newCompleted.push(currentMissionId);
        setCompletedMissions(newCompleted);
        await AsyncStorage.setItem('completedMissions', JSON.stringify(newCompleted));
      }

      // Calculate milestone base score based on number of completed rounds
      let baseScore = 0;
      const numLocked = newCompleted.length;
      if (numLocked === 3) baseScore = 1600;
      else if (numLocked === 2) baseScore = 850;
      else if (numLocked === 1) baseScore = 400;

      const calculatedPoints = baseScore;
      setScore(calculatedPoints);

      // If completing the 3rd round (toxic_spill), save the timer!
      let elapsed = null;
      if (currentMissionId === 'toxic_spill' && gameStartTime) {
        elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        setGameElapsedTime(elapsed);
        await AsyncStorage.setItem('game_elapsed_time', elapsed.toString());
      }

      // Update active team's points on the leaderboard
      let updatedTeams = [];
      if (isAdmin) {
        const adminRunId = await AsyncStorage.getItem('admin_run_id') || ('admin_run_' + Date.now().toString(36));
        await AsyncStorage.setItem('admin_run_id', adminRunId);

        const existingAdminRun = teams.find(t => t.id === adminRunId);
        if (existingAdminRun) {
          updatedTeams = teams.map(t => t.id === adminRunId ? {
            ...t,
            points: calculatedPoints,
            clearTime: elapsed || t.clearTime,
            isCompleted: numLocked === 3
          } : t);
        } else {
          const newAdminRun = {
            id: adminRunId,
            name: adminName || 'CN',
            clearTime: elapsed,
            points: calculatedPoints,
            isCompleted: numLocked === 3,
            isAdminRun: true,
            gamesPlayed: 1,
            attempts: elapsed ? [elapsed] : []
          };
          updatedTeams = [...teams, newAdminRun];
        }
      } else if (teamProfile) {
        updatedTeams = teams.map(t => {
          if (t.name === teamProfile.teamName) {
            return {
              ...t,
              points: calculatedPoints,
              clearTime: elapsed || t.clearTime,
              isCompleted: numLocked === 3,
              attempts: elapsed ? [...(t.attempts || []), elapsed] : (t.attempts || [])
            };
          }
          return t;
        });
      }

      if (updatedTeams.length > 0) {
        setTeams(updatedTeams);
        await AsyncStorage.setItem('registered_teams', JSON.stringify(updatedTeams));
        syncTeamsToSupabase(updatedTeams);
      }

      // Sync success stats to Supabase
      syncToSupabase({
        score: calculatedPoints,
        completedMissions: newCompleted,
        teamName
      });

      const stats = await AsyncStorage.getItem('stats');
      const parsedStats = stats ? JSON.parse(stats) : { gamesPlayed: 0, gamesWon: 0, highestScore: 0, totalVictimsSaved: 0, totalVillainsDefeated: 0 };
      
      parsedStats.gamesPlayed += 1;
      parsedStats.gamesWon += 1;
      parsedStats.highestScore = Math.max(parsedStats.highestScore, calculatedPoints);
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
      currentRoundIndex: solvedRiddleIndices.length,
      solvedRiddleIndices,
      isCurrentRiddleSolved: solvedRiddleIndices.includes(currentRiddleIndex),
      score,
      victimsSaved,
      isGameOver,
      gameWon,
      answerQuestion,
      nextQuestion,
      failRound,
      restartGame,
      resetTrigger,
      completedMissions,
      teamName,
      updateTeamName,
      promoteToNextLevel,
      teams,
      addTeam,
      deleteTeam,
      markTeamCompleted,
      gameElapsedTime,
      teamProfile,
      saveTeamProfile,
      logoutProfile,
      isAdmin,
      saveAdminLogin,
      adminName,
      saveAdminName,
      totalRounds: currentMission ? currentMission.riddles.length : 1
    }}>
      {children}
    </GameContext.Provider>
  );
};

