import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import Toolbar from '../components/Toolbar';
import GameClock from '../components/GameClock';
import { useGame } from '../context/GameContext';
import { ActionType } from '../types';
import { generatePuzzle } from '../utils/sudokuGenerator';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../utils/themeStyles';

const GameScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  // Puzzle loading is now handled in the route component

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      alignItems: 'center',
      // paddingVertical: 20,
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <GameClock />
        
        <View style={styles.boardContainer}>
          <SudokuBoard onCellSelect={handleCellSelect} />
        </View>
        
        <NumberPad selectedCell={selectedCell} />
        
        <Toolbar selectedCell={selectedCell} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default GameScreen;