import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { GameMode, ActionType } from '../types';
import { useGame } from '../context/GameContext';
import { MaterialIcons } from '@expo/vector-icons';

interface NumberPadProps {
  selectedCell: { row: number; col: number } | null;
}

const NumberPad: React.FC<NumberPadProps> = ({ selectedCell }) => {
  const { state, dispatch } = useGame();

  const handleNumberPress = (num: number) => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const cell = state.board[row][col];
    
    // Don't allow modifying initial cells
    if (cell.isInitial) return;
    
    switch (state.mode) {
      case GameMode.NORMAL:
        dispatch({
          type: ActionType.SET_VALUE,
          row,
          col,
          value: cell.value === num ? null : num, // Toggle value
        });
        break;
      
      case GameMode.CORNER_NOTES:
        dispatch({
          type: ActionType.SET_NOTES,
          row,
          col,
          noteType: 'corner',
          value: num,
        });
        break;
      
      case GameMode.CENTER_NOTES:
        dispatch({
          type: ActionType.SET_NOTES,
          row,
          col,
          noteType: 'center',
          value: num,
        });
        break;
    }
  };

  const handleClearPress = () => {
    if (!selectedCell) return;
    
    const { row, col } = selectedCell;
    const cell = state.board[row][col];
    
    // Don't allow modifying initial cells
    if (!cell || cell.isInitial) return;
    
    // Clear cell (both value and notes)
    dispatch({
      type: ActionType.CLEAR_CELL,
      row,
      col,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map(num => (
          <TouchableOpacity
            key={num}
            style={styles.button}
            onPress={() => handleNumberPress(num)}
          >
            <Text style={styles.buttonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {[6, 7, 8, 9].map(num => (
          <TouchableOpacity
            key={num}
            style={styles.button}
            onPress={() => handleNumberPress(num)}
          >
            <Text style={styles.buttonText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearPress}
        >
          <MaterialIcons name="clear" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: 360,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    width: 65,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#ffcdd2',
  },
});

export default NumberPad;