import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import Toolbar from '../components/Toolbar';
import GameClock from '../components/GameClock';
import { useGame } from '../context/GameContext';
import { ActionType } from '../types';
import { generatePuzzle } from '../utils/sudokuGenerator';

const GameScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const { id } = useLocalSearchParams();

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
  }, [dispatch, id]);

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <GameClock />
      
      <View style={styles.boardContainer}>
        <SudokuBoard onCellSelect={handleCellSelect} />
      </View>
      
      <NumberPad selectedCell={selectedCell} />
      
      <Toolbar selectedCell={selectedCell} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GameScreen;