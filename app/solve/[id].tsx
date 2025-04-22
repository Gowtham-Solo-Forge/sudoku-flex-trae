import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { GameProvider, useGame } from '../../src/context/GameContext';
import GameScreen from '../../src/screens/GameScreen';
import { ActionType } from '../../src/types';
import { getPuzzleById } from '../../src/services/firestore';
import Toast from 'react-native-toast-message';

export default function SolveGame() {
  return (
    <GameProvider>
      <SolveGameContent />
    </GameProvider>
  );
}

function SolveGameContent() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { dispatch } = useGame();

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        if (!id) return;
        
        const puzzle = await getPuzzleById(id as string);
        if (puzzle) {
          dispatch({ type: ActionType.START_GAME, initialBoard: puzzle.board });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Puzzle not found'
          });
          router.back();
        }
      } catch (error) {
        console.error('Error loading puzzle:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to load puzzle'
        });
        router.back();
      }
    };

    loadPuzzle();
  }, [id, dispatch, router]);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <GameScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    // paddingVertical: 8,
  },
  backButton: {
    // padding: 8,
  },
});