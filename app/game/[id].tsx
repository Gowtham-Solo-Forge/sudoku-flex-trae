import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameProvider } from '../../src/context/GameContext';
import GameScreen from '../../src/screens/GameScreen';
import { ActionType } from '../../src/types';
import { useGame } from '../../src/context/GameContext';

export default function Game() {
  const { id } = useLocalSearchParams();
  const { dispatch } = useGame();

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const puzzlesJson = await AsyncStorage.getItem('savedPuzzles');
        if (puzzlesJson) {
          const puzzles = JSON.parse(puzzlesJson);
          const puzzle = puzzles.find((p: any) => p.id === id);
          if (puzzle) {
            dispatch({ type: ActionType.START_GAME, initialBoard: puzzle.board });
          }
        }
      } catch (error) {
        console.error('Error loading puzzle:', error);
      }
    };

    loadPuzzle();
  }, [id, dispatch]);

  return (
    <View style={styles.container}>
      <GameProvider>
        <GameScreen />
      </GameProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});