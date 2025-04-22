import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Cell, GameMode } from '../types';
import { getCellSize, moderateScale } from '../utils/dimensions';
import { useTheme } from '../context/ThemeContext';
import { getThemeColors } from '../utils/themeStyles';

interface SudokuCellProps {
  cell: Cell;
  row: number;
  col: number;
  onPress: (row: number, col: number) => void;
  isSelected: boolean;
  isInSelectedRow?: boolean;
  isInSelectedCol?: boolean;
}

const SudokuCell: React.FC<SudokuCellProps> = ({ cell, row, col, onPress, isSelected, isInSelectedRow = false, isInSelectedCol = false }) => {
  const { value, notes, isInitial, isValid } = cell;
  const { theme } = useTheme();
  const colors = getThemeColors(theme);

  // Determine background color based on cell state
  const getBgColor = () => {
    if (isValid === false) return colors.invalidCellBackground;
    if (isInSelectedRow || isInSelectedCol) return colors.highlightedRowColBackground;
    if ((Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 0) {
      return colors.cellBackground;
    }
    return colors.boardBackground;
  };

  // Render corner notes in a single line
  const renderCornerNotes = () => {
    if (notes.corner.length === 0) return null;
    
    return (
      <View style={styles.cornerNotes}>
        {notes.corner.map(num => (
          <Text key={num} style={styles.noteText}>{num}</Text>
        ))}
      </View>
    );
  };

  // Render center notes
  const renderCenterNotes = () => {
    if (notes.center.length === 0) return null;
    
    return (
      <View style={styles.centerNotes}>
        {notes.center.map(num => (
          <Text key={num} style={styles.centerNoteText}>{num}</Text>
        ))}
      </View>
    );
  };

  const styles = StyleSheet.create({
    selectedCell: {
      borderWidth: 2,
      borderColor: colors.selectedCellBackground
    },
    cell: {
      width: getCellSize(),
      height: getCellSize(),
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      position: 'relative',
    },
    valueText: {
      fontSize: moderateScale(20),
      fontWeight: '500',
      color: colors.cellText,
    },
    initialValue: {
      fontWeight: 'bold',
      color: colors.initialCellText,
      backgroundColor: colors.initialCellBackground,
      width: '100%',
      height: '100%',
      textAlign: 'center',
      textAlignVertical: 'center',
      paddingTop: 8, // Adjust vertical alignment
    },
    cornerNotes: {
      position: 'absolute',
      top: 2,
      left: 2,
      maxWidth: '100%',
      height: 10,
      flexDirection: 'row',
      overflow: 'hidden',
    },
    noteText: {
      fontSize: moderateScale(8),
      marginHorizontal: 1,
      color: colors.noteText,
    },
    emptyNote: {
      width: 0,
      height: 0,
    },
    centerNotes: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
    },
    centerNoteText: {
      fontSize: moderateScale(10),
      marginHorizontal: 2,
      color: '#666',
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { backgroundColor: getBgColor() },
        isSelected && styles.selectedCell
      ]}
      onPress={() => onPress(row, col)}
      activeOpacity={0.7}
    >
      {value ? (
        <Text style={[styles.valueText, isInitial && styles.initialValue]}>
          {value}
        </Text>
      ) : (
        <>
          {renderCornerNotes()}
          {renderCenterNotes()}
        </>
      )}
    </TouchableOpacity>
  );
};

export default SudokuCell;