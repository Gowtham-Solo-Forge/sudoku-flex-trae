import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions that the design was created for
const baseWidth = 375;
const baseHeight = 812;

// Scaling factors
const widthScale = width / baseWidth;
const heightScale = height / baseHeight;

// Use this for elements that should scale with screen width
export const scale = (size: number): number => Math.round(size * widthScale);

// Use this for elements that should scale with screen height
export const verticalScale = (size: number): number => Math.round(size * heightScale);

// Use this for padding/margin/fontSize that should scale less aggressively
export const moderateScale = (size: number, factor = 0.5): number => 
  Math.round(size + (scale(size) - size) * factor);

// Screen dimensions export for convenience
export const screenWidth = width;
export const screenHeight = height;

// Sudoku board specific scaling
export const getBoardSize = (): number => {
  // Make the board size responsive but with a maximum size
  const maxBoardSize = 360; // Original board size
  const idealBoardSize = width * 0.9; // 90% of screen width
  return Math.min(idealBoardSize, maxBoardSize);
};

// Calculate cell size based on board size
export const getCellSize = (): number => {
  return getBoardSize() / 9;
};

// Calculate number pad button size based on available width
export const getNumberButtonSize = (): { width: number; height: number } => {
  const padWidth = getBoardSize();
  const buttonWidth = (padWidth - 40) / 5; // 5 buttons per row with some spacing
  return {
    width: buttonWidth,
    height: buttonWidth * 0.8, // Slightly shorter height for better appearance
  };
};