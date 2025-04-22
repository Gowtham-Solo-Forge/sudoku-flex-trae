// Theme styles for the app

export interface ThemeColors {
  // Background colors
  background: string;
  boardBackground: string;
  cellBackground: string;
  selectedCellBackground: string;
  highlightedRowColBackground: string;
  initialCellBackground: string;
  invalidCellBackground: string;
  
  // Text colors
  text: string;
  cellText: string;
  initialCellText: string;
  noteText: string;
  
  // UI element colors
  buttonBackground: string;
  buttonText: string;
  activeButtonBackground: string;
  activeButtonBorder: string;
  saveButtonBackground: string;
  easyButtonBackground: string;
  mediumButtonBackground: string;
  hardButtonBackground: string;
  dangerButtonBackground: string;
  dangerButtonText: string;
  disabledText: string;
  loadingOverlay: string;
  loadingBackground: string;
  loadingText: string;
  
  // Border colors
  border: string;
  thickBorder: string;
}

export const lightTheme: ThemeColors = {
  // Background colors
  background: '#ffffff',
  boardBackground: '#ffffff',
  cellBackground: '#f5f5f5',
  selectedCellBackground: '#bbdefb',
  highlightedRowColBackground: 'rgba(227, 242, 253, 0.6)',
  initialCellBackground: '#f0f0f0',
  invalidCellBackground: '#ffcdd2',
  
  // Text colors
  text: '#333333',
  cellText: '#2196F3', // User input numbers in blue
  initialCellText: '#000000', // Puzzle numbers in black
  noteText: '#666666',
  
  // UI element colors
  buttonBackground: '#f0f0f0',
  buttonText: '#000000',
  activeButtonBackground: '#bbdefb',
  activeButtonBorder: '#90caf9',
  saveButtonBackground: 'rgb(94, 172, 255)',
  easyButtonBackground: '#4CAF50',
  mediumButtonBackground: '#FF9800',
  hardButtonBackground: '#F44336',
  dangerButtonBackground: '#ff3b30',
  dangerButtonText: '#ffffff',
  disabledText: '#aaaaaa',
  loadingOverlay: 'rgba(255, 255, 255, 0.9)',
  loadingBackground: '#ffffff',
  loadingText: '#007AFF',
  
  // Border colors
  border: '#cccccc',
  thickBorder: '#000000',
};

export const darkTheme: ThemeColors = {
  // Background colors
  background: '#121212',
  boardBackground: '#1e1e1e',
  cellBackground: '#2c2c2c',
  selectedCellBackground: '#1a3f5f',
  highlightedRowColBackground: 'rgba(30, 60, 90, 0.6)',
  initialCellBackground: '#3a3a3a',
  invalidCellBackground: '#5f2120',
  
  // Text colors
  text: '#e0e0e0',
  cellText: '#64B5F6', // User input numbers in light blue
  initialCellText: '#ffffff', // Puzzle numbers in white
  noteText: '#aaaaaa',
  
  // UI element colors
  buttonBackground: '#333333',
  buttonText: '#e0e0e0',
  activeButtonBackground: '#1a3f5f',
  activeButtonBorder: '#2196f3',
  saveButtonBackground: '#0a84ff',
  easyButtonBackground: '#2e7d32',
  mediumButtonBackground: '#e65100',
  hardButtonBackground: '#c62828',
  dangerButtonBackground: '#c62828',
  dangerButtonText: '#ffffff',
  disabledText: '#666666',
  loadingOverlay: 'rgba(0, 0, 0, 0.8)',
  loadingBackground: '#1e1e1e',
  loadingText: '#0a84ff',
  
  // Border colors
  border: '#444444',
  thickBorder: '#e0e0e0',
};

export const getThemeColors = (theme: 'light' | 'dark'): ThemeColors => {
  return theme === 'light' ? lightTheme : darkTheme;
};