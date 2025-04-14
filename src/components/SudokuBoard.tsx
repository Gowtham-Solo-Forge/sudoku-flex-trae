import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Board, GameMode, ActionType } from '../types';
import SudokuCell from './SudokuCell';
import { useGame } from '../context/GameContext';

interface SudokuBoardProps {
  onCellSelect: (row: number, col: number) => void;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ onCellSelect }) => {
  const { state } = useGame();
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const handleCellPress = (row: number, col: number) => {
    setSelectedCell({ row, col });
    onCellSelect(row, col);
  };

  return (
    <View style={styles.board}>
      {state.board.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell, colIndex) => (
            <SudokuCell
              key={`cell-${rowIndex}-${colIndex}`}
              cell={cell}
              row={rowIndex}
              col={colIndex}
              onPress={handleCellPress}
              isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
              isInSelectedRow={selectedCell?.row === rowIndex}
              isInSelectedCol={selectedCell?.col === colIndex}
            />
          ))}
        </View>
      ))}
      {/* Render thick grid lines */}
      <View style={[styles.thickLine, styles.horizontalLine1]} />
      <View style={[styles.thickLine, styles.horizontalLine2]} />
      <View style={[styles.thickLine, styles.verticalLine1]} />
      <View style={[styles.thickLine, styles.verticalLine2]} />
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: 360,
    height: 360,
    borderWidth: 2,
    borderColor: '#000',
    position: 'relative',
    backgroundColor: '#fff',
    overflow: 'hidden', // Ensure borders are contained
  },
  row: {
    flexDirection: 'row',
  },
  thickLine: {
    backgroundColor: '#000',
    position: 'absolute',
  },
  horizontalLine1: {
    width: '100%',
    height: 2,
    top: 120 - 1, // Adjust for border width
  },
  horizontalLine2: {
    width: '100%',
    height: 2,
    top: 240 - 1, // Adjust for border width
  },
  verticalLine1: {
    width: 2,
    height: '100%',
    left: 120 - 1, // Adjust for border width
  },
  verticalLine2: {
    width: 2,
    height: '100%',
    left: 240 - 1, // Adjust for border width
  },
});

export default SudokuBoard;