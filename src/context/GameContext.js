import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { missions } from '../data/riddles';
import { supabase } from '../lib/supabase';

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
  const [completedMissions, setCompletedMissions] = useState([]);
  const [teamName, setTeamNameState] = useState('');
  const [teams, setTeams] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [gameElapsedTime, setGameElapsedTime] = useState(null);
  const [teamProfile, setTeamProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedbackRatings, setFeedbackRatings] = useState([]);
  const [adminName, setAdminName] = useState('CN');
  const [timerResetPenalty, setTimerResetPenalty] = useState(0);

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
      
      const savedCompleted = await AsyncStorage.getItem('completedMissions');
      if (savedCompleted) setCompletedMissions(JSON.parse(savedCompleted));

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

      const savedFeedback = await AsyncStorage.getItem('feedback_ratings');
      if (savedFeedback) setFeedbackRatings(JSON.parse(savedFeedback));

      const savedAdminName = await AsyncStorage.getItem('admin_name');
      if (savedAdminName) setAdminName(savedAdminName);

      const savedTimerResetPenalty = await AsyncStorage.getItem('timer_reset_penalty');
      if (savedTimerResetPenalty) setTimerResetPenalty(parseInt(savedTimerResetPenalty));
    } catch (e) {
      console.error('Failed to load stats from storage');
    }
  };

  const saveStats = async (newDebt) => {
    try {
      await AsyncStorage.setItem('debt', newDebt.toString());
    } catch (e) {
      console.error('Failed to save debt');
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
          debt: updatedStats.debt || 0,
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
        debt,
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
        debt,
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

  const answerQuestion = (isCorrect) => {
    if (isCorrect) {
      const mission = missions[currentMissionId];
      const currentRiddle = mission.riddles[currentRiddleIndex];
      const pointsEarned = currentRiddle.points;
      const newScore = score + pointsEarned;
      setScore(newScore);

      // Save 4 victims on easy level, 2 on boss, etc.
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
    let penalty = 0;
    if (currentMissionId === 'rooftop_witness') penalty = 200;
    else if (currentMissionId === 'vault_breaker') penalty = 225;
    else if (currentMissionId === 'toxic_spill') penalty = 375;

    const newPenalty = timerResetPenalty + penalty;
    setTimerResetPenalty(newPenalty);
    AsyncStorage.setItem('timer_reset_penalty', newPenalty.toString());

    if (['rooftop_witness', 'vault_breaker', 'toxic_spill'].includes(currentMissionId)) {
      // Restart the round
      setCurrentRiddleIndex(0);
      setScore(0);
      setResetTrigger(prev => prev + 1);
    } else {
      // Standard game over
      const debtAdded = Math.floor(score / 2);
      const newDebt = debt + debtAdded;
      setDebt(newDebt);
      saveStats(newDebt);
      
      setCurrentRiddleIndex(0);
      setScore(0);
      setVictimsSaved(0);
      setIsGameOver(true);
      setGameWon(false);
      
      // Sync failure stats to Supabase
      syncToSupabase({
        debt: newDebt,
        completedMissions,
        teamName
      });
    }
  };

  const restartGame = async (missionId = 'toxic_spill') => {
    setCurrentMissionId(missionId);
    setCurrentRiddleIndex(0);
    setScore(0);
    setVictimsSaved(0);
    setIsGameOver(false);
    setGameWon(false);
    setResetTrigger(prev => prev + 1);
    
    setTimerResetPenalty(0);
    await AsyncStorage.setItem('timer_reset_penalty', '0');

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
      debt,
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
      setTimerResetPenalty(0);
      await AsyncStorage.setItem('timer_reset_penalty', '0');
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

  const resetRatings = async () => {
    try {
      setFeedbackRatings([]);
      await AsyncStorage.removeItem('feedback_ratings');
      await supabase.from('feedback_ratings').delete().neq('id', 'placeholder');
    } catch (e) {
      console.error('Failed to reset feedback ratings', e.message);
    }
  };

  const submitFeedback = async (ratings) => {
    try {
      const newRating = {
        id: 'rate_' + Date.now().toString(36),
        teamName: isAdmin ? (adminName || 'CN') : (teamProfile?.teamName || 'ANONYMOUS'),
        membersCount: isAdmin ? 0 : (teamProfile?.membersCount || 0),
        overallExperience: ratings.overallExperience,
        eventContent: ratings.eventContent,
        logistics: ratings.logistics,
        volunteers: ratings.volunteers,
        futureInterests: ratings.futureInterests,
        createdAt: new Date().toISOString()
      };
      
      const updatedRatings = [...feedbackRatings, newRating];
      setFeedbackRatings(updatedRatings);
      await AsyncStorage.setItem('feedback_ratings', JSON.stringify(updatedRatings));

      // Sync ratings to Supabase
      let profileId = await AsyncStorage.getItem('supabase_profile_id');
      if (!profileId) {
        profileId = 'player_' + Math.random().toString(36).substring(2, 15);
        await AsyncStorage.setItem('supabase_profile_id', profileId);
      }
      await supabase
        .from('feedback_ratings')
        .upsert({
          id: newRating.id,
          profile_id: profileId,
          team_name: newRating.teamName,
          members_count: newRating.membersCount,
          overall_experience: newRating.overallExperience,
          event_content: newRating.eventContent,
          logistics: newRating.logistics,
          volunteers: newRating.volunteers,
          future_interests: newRating.futureInterests,
          created_at: newRating.createdAt
        });
    } catch (err) {
      console.log('Feedback submit Supabase sync warning:', err.message);
    }
  };

  const saveFinalStats = async (finalScore) => {
    try {
      const newCompleted = [...completedMissions];
      if (!newCompleted.includes(currentMissionId)) {
        newCompleted.push(currentMissionId);
        setCompletedMissions(newCompleted);
        await AsyncStorage.setItem('completedMissions', JSON.stringify(newCompleted));
      }

      // If completing the 3rd round (toxic_spill), save the timer!
      let elapsed = null;
      if (currentMissionId === 'toxic_spill' && gameStartTime) {
        elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        setGameElapsedTime(elapsed);
        await AsyncStorage.setItem('game_elapsed_time', elapsed.toString());

        let updatedTeams = [];
        const calculatedPoints = Math.max(0, 1600 - timerResetPenalty);
        if (isAdmin) {
          const newAdminRun = {
            id: 'admin_run_' + Date.now().toString(36),
            name: adminName || 'CN',
            clearTime: elapsed,
            points: calculatedPoints,
            isCompleted: true,
            isAdminRun: true,
            gamesPlayed: 1,
            attempts: [elapsed]
          };
          updatedTeams = [...teams, newAdminRun];
        } else {
          updatedTeams = teams.map(t => {
            if (!t.isCompleted) {
              const teamAttempts = [...(t.attempts || []), elapsed];
              return { 
                 ...t, 
                 clearTime: elapsed,
                 points: calculatedPoints,
                 attempts: teamAttempts
              };
            }
            return t;
          });
        }
        setTeams(updatedTeams);
        await AsyncStorage.setItem('registered_teams', JSON.stringify(updatedTeams));
        syncTeamsToSupabase(updatedTeams);
      }

      // Sync success stats to Supabase
      syncToSupabase({
        score: finalScore,
        debt,
        completedMissions: newCompleted,
        teamName
      });

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
      feedbackRatings,
      submitFeedback,
      resetRatings,
      timerResetPenalty,
      totalRounds: currentMission ? currentMission.riddles.length : 1
    }}>
      {children}
    </GameContext.Provider>
  );
};
