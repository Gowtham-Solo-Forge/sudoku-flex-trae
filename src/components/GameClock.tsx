import React, { useEffect } from 'react';
import { StyleSheet, View, Text, AppState } from 'react-native';
import { useGame } from '../context/GameContext';
import { ActionType } from '../types';

const GameClock: React.FC = () => {
  const { state, dispatch } = useGame();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        dispatch({ type: ActionType.RESUME_GAME });
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        dispatch({ type: ActionType.PAUSE_GAME });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [dispatch]);
  
  // Format time as MM:SS
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.clockIcon}>⏱️</Text>
      <Text style={styles.timeText}>{formatTime(state.elapsedTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    width: 120,
    alignSelf: 'center',
  },
  clockIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});

export default GameClock;