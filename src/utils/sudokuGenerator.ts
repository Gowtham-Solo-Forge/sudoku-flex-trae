// Utility functions for generating and solving Sudoku puzzles

import { Board, Cell } from '../types';

// Create an empty 9x9 Sudoku board
export const createEmptyBoard = (): Board => {
  return Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => ({
      value: null,
      notes: { corner: [], center: [] },
      isInitial: false,
    }))
  );
};

// Check if a number can be placed in a specific position
const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[boxRow + r][boxCol + c] === num) {
        return false;
      }
    }
  }

  return true;
};

// Solve the Sudoku puzzle using backtracking
const solveSudoku = (board: number[][]): boolean => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            
            if (solveSudoku(board)) {
              return true;
            }
            
            board[row][col] = 0; // Backtrack
          }
        }
        return false; // No valid number found
      }
    }
  }
  return true; // All cells filled
};

// Generate a solved Sudoku board
const generateSolvedBoard = (): number[][] => {
  const board: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Fill diagonal boxes first (these can be filled independently)
  for (let box = 0; box < 3; box++) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffleArray(nums);
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[box * 3 + i][box * 3 + j] = nums[i * 3 + j];
      }
    }
  }
  
  // Solve the rest of the board
  solveSudoku(board);
  return board;
};

// Shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): void => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

// Generate a Sudoku puzzle with the specified difficulty
export const generatePuzzle = (difficulty: 'easy' | 'medium' | 'hard'): Board => {
  // Generate a solved board
  const solvedBoard = generateSolvedBoard();
  
  // Create a copy to remove numbers from
  const puzzle: number[][] = solvedBoard.map(row => [...row]);
  
  // Determine how many cells to remove based on difficulty
  let cellsToRemove: number;
  switch (difficulty) {
    case 'easy':
      cellsToRemove = 40; // 41 clues (81 - 40)
      break;
    case 'medium':
      cellsToRemove = 50; // 31 clues
      break;
    case 'hard':
      cellsToRemove = 60; // 21 clues
      break;
    default:
      cellsToRemove = 45;
  }
  
  // Create a list of all positions
  const positions: [number, number][] = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      positions.push([row, col]);
    }
  }
  
  // Shuffle the positions
  shuffleArray(positions);
  
  // Remove cells
  for (let i = 0; i < cellsToRemove; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = 0;
  }
  
  // Convert to our Board type
  const board: Board = Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
      value: null,
      notes: { corner: [], center: [] },
      isInitial: false,
      isValid: true
    }))
  );
  
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = puzzle[row][col];
      board[row][col] = {
        value: value === 0 ? null : value,
        notes: { corner: [], center: [] },
        isInitial: value !== 0,
        isValid: true
      };
    }
  }
  
  return board;
};