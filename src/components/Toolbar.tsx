import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import { GameMode, ActionType } from '../types';
import { MaterialIcons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../utils/themeStyles';

interface ToolbarProps {
  selectedCell: { row: number; col: number } | null;
}

const Toolbar: React.FC<ToolbarProps> = ({ selectedCell }) => {
  const { state, dispatch } = useGame();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  const handleModeChange = (mode: GameMode) => {
    dispatch({ type: ActionType.SET_MODE, mode });
  };

  const handleUndo = () => {
    dispatch({ type: ActionType.UNDO });
  };

  const handleRedo = () => {
    dispatch({ type: ActionType.REDO });
  };

  const [validationTriggered, setValidationTriggered] = useState(false);

  const handleValidate = () => {
    dispatch({ type: ActionType.VALIDATE });
    setTimeout(() => {
      setValidationTriggered(true);
    }, 200);
  };

  // Add effect to handle validation toast
  useEffect(() => {
    if (validationTriggered) {
      const hasErrors = state.board.some(row => 
        row.some(cell => cell.isValid === false)
      );
  
      Toast.show({
        type: hasErrors ? 'error' : 'success',
        text1: hasErrors ? 'Validation Failed' : 'Validation Successful',
        text2: hasErrors ? 'There are some errors in your solution' : 'Your solution is correct so far!'
      });
  
      setValidationTriggered(false);
    }
  }, [validationTriggered]);

  const handleClear = () => {
    if (!selectedCell) return;
    
    Alert.alert(
      'Clear Notes',
      'Are you sure you want to clear all notes for this cell?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          onPress: () => {
            dispatch({
              type: ActionType.CLEAR_CELL,
              row: selectedCell.row,
              col: selectedCell.col
            });
            Toast.show({
              type: 'success',
              text1: 'Notes Cleared',
              text2: 'Cell notes have been cleared'
            });
          }
        }
      ]
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Game',
      'Are you sure you want to reset? This will clear all non-initial cells and reset the timer.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: ActionType.RESET_GAME });
            Toast.show({
              type: 'success',
              text1: 'Game Reset',
              text2: 'The game has been reset'
            });
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      marginTop: 15,
      width: 360,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginBottom: 8,
    },
    button: {
      display: 'flex',
      flexDirection: 'column', // Change to column layout for label on to
      width: 60,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.buttonBackground,
      borderRadius: 6,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      padding: 2,
    },
    activeButton: {
      backgroundColor: colors.activeButtonBackground,
      borderWidth: 1,
      borderColor: colors.activeButtonBorder,
    },
    buttonText: {
      fontSize: 16,
      lineHeight: 16,
    },
    buttonLabel: {
      fontSize: 10,
      lineHeight: 10,
    },
    disabledText: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.button, state.mode === GameMode.NORMAL && styles.activeButton]}
          onPress={() => handleModeChange(GameMode.NORMAL)}
        >
          <MaterialIcons name="edit" size={20} color="#666" />
          <Text style={styles.buttonLabel}>Normal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, state.mode === GameMode.CORNER_NOTES && styles.activeButton]}
          onPress={() => handleModeChange(GameMode.CORNER_NOTES)}
        >
          <MaterialIcons name="align-horizontal-left" size={20} color="#666" />
          <Text style={styles.buttonLabel}>Corner</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, state.mode === GameMode.CENTER_NOTES && styles.activeButton]}
          onPress={() => handleModeChange(GameMode.CENTER_NOTES)}
        >
          <MaterialIcons name="vertical-align-center" size={20} color="#666" />
          <Text style={styles.buttonLabel}>Center</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleClear}
        >
          <MaterialIcons name="clear" size={20} color="#666" />
          <Text style={styles.buttonLabel}>Clear Notes</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleUndo}
          disabled={state.historyIndex <= 0}
        >
          <MaterialIcons name="undo" size={20} color={state.historyIndex <= 0 ? '#ccc' : '#666'} />
          <Text style={[styles.buttonLabel, state.historyIndex <= 0 && styles.disabledText]}>Undo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleRedo}
          disabled={state.historyIndex >= state.history.length - 1}
        >
          <MaterialIcons name="redo" size={20} color={state.historyIndex >= state.history.length - 1 ? '#ccc' : '#666'} />
          <Text style={[styles.buttonLabel, state.historyIndex >= state.history.length - 1 && styles.disabledText]}>Redo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
        >
          <MaterialIcons name="refresh" size={20} color="#666" />
          <Text style={styles.buttonLabel}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={handleValidate}
        >
          <MaterialIcons name="check" size={20} color="#666" />
          <Text style={styles.buttonLabel}>Check</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Toolbar;