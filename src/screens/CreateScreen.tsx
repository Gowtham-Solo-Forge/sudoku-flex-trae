import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, Modal, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import { useGame } from '../context/GameContext';
import { ActionType } from '../types';
import CameraScreen from '../components/CameraScreen';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { generatePuzzle } from '../utils/sudokuGenerator';
import { savePuzzle } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

const CreateScreen: React.FC = () => {
  const { state, dispatch } = useGame();
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const generatePuzzleWithDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    const newBoard = generatePuzzle(difficulty);
    dispatch({ type: ActionType.START_GAME, initialBoard: newBoard });
    Toast.show({
      type: 'success',
      text1: 'Puzzle Generated',
      text2: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} puzzle created`
    });
  };

  const processImage = async (imageUri: string) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'sudoku.jpg',
      } as any);
  
      const response = await fetch(process.env.EXPO_PUBLIC_OCR_API_URL!, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to process image');
      }
  
      const data = await response.json();
      if (data && data.status === "success" && data.board) {
        const newBoard = state.board.map((row, i) =>
          row.map((cell, j) => ({
            ...cell,
            value: data.board[i][j] === 0 ? null : data.board[i][j],
            isInitial: data.board[i][j] !== 0,
            isValid: true,
            notes: { corner: [], center: [] }
          }))
        );
        dispatch({ type: ActionType.START_GAME, initialBoard: newBoard });
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Puzzle loaded successfully'
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to process image'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      processImage(result.assets[0].uri);
    }
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
  };

  const handleSavePuzzle = async () => {
    // Check if there are any numbers on the board
    const hasNumbers = state.board.some(row => row.some(cell => cell.value !== null));
    
    if (!hasNumbers) {
      Toast.show({
        type: 'error',
        text1: 'Empty Board',
        text2: 'Please add some numbers before saving'
      });
      return;
    }

    // Check if user is authenticated
    if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Authentication Required',
        text2: 'Please log in to save puzzles'
      });
      return;
    }

    Alert.alert(
      'Save Puzzle',
      'Are you sure you want to save this puzzle?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              // Mark all filled cells as initial cells
              const finalBoard = state.board.map(row =>
                row.map(cell => ({
                  ...cell,
                  isInitial: cell.value !== null,
                  notes: { corner: [], center: [] } // Clear any notes
                }))
              );

              // Save to Firestore
              const puzzleId = await savePuzzle(finalBoard);

              // Show success message
              Toast.show({ 
                type: 'success', 
                text1: 'Puzzle Saved', 
                text2: `Puzzle saved to your collection` 
              });

              // Navigate back
              router.back();
              
              // Clear the board and reset state
              const emptyBoard = Array(9).fill(null).map(() =>
                Array(9).fill(null).map(() => ({
                  value: null,
                  notes: { corner: [], center: [] },
                  isInitial: false,
                  isValid: true
                }))
              );
              dispatch({ type: ActionType.START_GAME, initialBoard: emptyBoard });
            } catch (error) {
              console.error('Error saving puzzle:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to save puzzle'
              });
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const clearBoard = () => {
    Alert.alert(
      'Clear Board',
      'Are you sure you want to clear the board? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            const emptyBoard = Array(9).fill(null).map(() =>
              Array(9).fill(null).map(() => ({
                value: null,
                notes: { corner: [], center: [] },
                isInitial: false,
                isValid: true
              }))
            );
            dispatch({ type: ActionType.START_GAME, initialBoard: emptyBoard });
            // setSelectedCell(null);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Processing image...</Text>
          </View>
        </View>
      )}
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>
        <Text style={styles.title}>Create Puzzle</Text>

        <View style={styles.boardContainer}>
          <SudokuBoard onCellSelect={handleCellSelect} />
        </View>
        
        <NumberPad selectedCell={selectedCell} />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setShowCamera(true)}>
            <MaterialIcons name="camera-alt" size={20} color="#000" />
            <Text style={styles.buttonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <MaterialIcons name="image" size={20} color="#000" />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={clearBoard}>
            <MaterialIcons name="clear" size={20} color="#000" />
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSavePuzzle}>
            <MaterialIcons name="save" size={20} color="#000" />
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.difficultyButtonContainer}>
          <Text style={styles.buttonText}>Generate</Text>
          <TouchableOpacity 
            style={[styles.button, styles.easyButton]} 
            onPress={() => generatePuzzleWithDifficulty('easy')}
          >
            <Text style={styles.buttonText}>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.mediumButton]} 
            onPress={() => generatePuzzleWithDifficulty('medium')}
          >
            <Text style={styles.buttonText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.hardButton]} 
            onPress={() => generatePuzzleWithDifficulty('hard')}
          >
            <Text style={styles.buttonText}>Hard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showCamera} animationType="slide">
        <CameraScreen
          onClose={() => setShowCamera(false)}
          onCapture={(photo) => {
            setShowCamera(false);
            processImage(photo.uri);
          }}
        />
      </Modal>      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  difficultyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  difficultyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  easyButton: {
    backgroundColor: '#4CAF50',
  },
  mediumButton: {
    backgroundColor: '#FF9800',
  },
  hardButton: {
    backgroundColor: '#F44336',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30, // Add padding at the bottom for scrolling
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '90%',
    marginVertical: 10,
    flexWrap: 'wrap', // Allow buttons to wrap on smaller screens
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    width: 65,
    height: 50,
    elevation: 2,
    margin: 4, // Add margin for when buttons wrap
  },
  saveButton: {
    backgroundColor: 'rgb(94, 172, 255)',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
  },
  difficultyButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '90%',
    marginVertical: 10,
    backgroundColor: 'rgb(147, 196, 253)',
    padding: 8,
    borderRadius: 6,
    elevation: 2,
    flexWrap: 'wrap', // Allow buttons to wrap on smaller screens
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007AFF',
  },
});

export default CreateScreen;