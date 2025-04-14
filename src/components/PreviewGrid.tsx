import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PreviewGridProps {
  board: any[][];
}

const PreviewGrid: React.FC<PreviewGridProps> = ({ board }) => {
  return (
    <View style={styles.container}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell: any, colIndex: number) => (
            <View 
              key={`${rowIndex}-${colIndex}`} 
              style={[
                styles.cell,
                colIndex % 3 === 2 && colIndex < 8 && styles.rightBorder,
                rowIndex % 3 === 2 && rowIndex < 8 && styles.bottomBorder
              ]}
            >
              <Text style={[styles.number, cell.isInitial && styles.initialNumber]}>
                {cell.value || ''}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  number: {
    fontSize: 8,
    color: '#666',
  },
  initialNumber: {
    color: '#000',
    fontWeight: '600',
  },
});

export default PreviewGrid;