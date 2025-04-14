import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, Board, GameMode, Action, ActionType, Cell, CellValue } from '../types';
import { AppState, AppStateStatus } from 'react-native';

// Create an empty 9x9 Sudoku board
const createEmptyBoard = (): Board => {
  return Array(9).fill(null).map(() => 
    Array(9).fill(null).map(() => ({
      value: null,
      notes: { corner: [], center: [] },
      isInitial: false,
    }))
  );
};

// Initial game state
const initialState: GameState = {
  board: createEmptyBoard(),
  mode: GameMode.NORMAL,
  history: [],
  historyIndex: -1,
  startTime: 0,
  elapsedTime: 0,
  isActive: false,
  isPaused: false,
  initialBoard: createEmptyBoard(),
};

// Clear a cell's value and notes
const clearCell = (cell: Cell): Cell => ({
  ...cell,
  value: null,
  notes: { corner: [], center: [] }
});

// Game state reducer
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case ActionType.START_GAME: {
      const initialBoard = action.initialBoard;
      return {
        ...state,
        board: initialBoard,
        initialBoard: initialBoard,
        history: [initialBoard],
        historyIndex: 0,
        startTime: Date.now(),
        elapsedTime: 0,
        isActive: true,
        isPaused: false,
      };
    }

    case ActionType.RESET_GAME: {
      const resetBoard = state.board.map((row, i) =>
        row.map((cell, j) => ({
          ...cell,
          value: state.initialBoard[i][j].isInitial ? state.initialBoard[i][j].value : null,
          notes: { corner: [], center: [] },
          isValid: true
        }))
      );

      return {
        ...state,
        board: resetBoard,
        history: [resetBoard],
        historyIndex: 0,
        startTime: Date.now(),
        elapsedTime: 0,
        isActive: true,
        isPaused: false,
      };
    }

    case ActionType.START_GAME: {
      return {
        ...state,
        board: action.initialBoard,
        history: [action.initialBoard],
        historyIndex: 0,
        startTime: Date.now(),
        elapsedTime: 0,
        isActive: true,
        isPaused: false,
      };
    }

    case ActionType.SET_VALUE: {
      const { row, col, value } = action;
      const newBoard = state.board.map((r, i) =>
        r.map((cell, j) => {
          if (i === row && j === col && !cell.isInitial) {
            return { ...cell, value };
          }
          return cell;
        })
      );

      // Add to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newBoard);

      return {
        ...state,
        board: newBoard,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
      };
    }

    case ActionType.SET_NOTES: {
      const { row, col, noteType, value } = action;
      const newBoard = state.board.map((r, i) =>
        r.map((cell, j) => {
          if (i === row && j === col && !cell.isInitial) {
            const notes = { ...cell.notes };
            const noteArray = [...notes[noteType]];
            
            // Toggle note value
            const index = noteArray.indexOf(value);
            if (index === -1) {
              noteArray.push(value);
            } else {
              noteArray.splice(index, 1);
            }
            
            notes[noteType] = noteArray;
            return { ...cell, notes };
          }
          return cell;
        })
      );

      // Add to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newBoard);

      return {
        ...state,
        board: newBoard,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
      };
    }

    case ActionType.SET_MODE: {
      return {
        ...state,
        mode: action.mode,
      };
    }

    case ActionType.UNDO: {
      if (state.historyIndex > 0) {
        return {
          ...state,
          board: state.history[state.historyIndex - 1],
          historyIndex: state.historyIndex - 1,
        };
      }
      return state;
    }

    case ActionType.REDO: {
      if (state.historyIndex < state.history.length - 1) {
        return {
          ...state,
          board: state.history[state.historyIndex + 1],
          historyIndex: state.historyIndex + 1,
        };
      }
      return state;
    }

    case ActionType.CLEAR_CELL: {
      const { row, col } = action;
      const newBoard = state.board.map((r, i) =>
        r.map((cell, j) => {
          if (i === row && j === col && !cell.isInitial) {
            return clearCell(cell);
          }
          return cell;
        })
      );

      // Add to history
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newBoard);

      return {
        ...state,
        board: newBoard,
        history: newHistory,
        historyIndex: state.historyIndex + 1,
      };
    }

    case ActionType.VALIDATE: {
      // Reset previous validation states and create a new board with validation status
      const resetBoard = state.board.map(row =>
        row.map(cell => ({ ...cell, isValid: undefined }))
      );
      const newBoard = validateBoard(resetBoard);
      return {
        ...state,
        board: newBoard,
      };
    }

    case ActionType.PAUSE_GAME: {
      return {
        ...state,
        isPaused: true,
      };
    }

    case ActionType.RESUME_GAME: {
      return {
        ...state,
        isPaused: false,
      };
    }

    case ActionType.UPDATE_TIME: {
      return {
        ...state,
        elapsedTime: action.elapsedTime,
      };
    }

    default:
      return state;
  }
};

// Validate the entire Sudoku board
const validateBoard = (board: Board): Board => {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  
  // Check rows
  for (let row = 0; row < 9; row++) {
    const values = new Set<CellValue>();
    for (let col = 0; col < 9; col++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (values.has(value)) {
          // Mark all cells with this value in this row as invalid
          for (let c = 0; c < 9; c++) {
            if (board[row][c].value === value) {
              newBoard[row][c].isValid = false;
            }
          }
        } else {
          values.add(value);
        }
      }
    }
  }

  // Check columns
  for (let col = 0; col < 9; col++) {
    const values = new Set<CellValue>();
    for (let row = 0; row < 9; row++) {
      const value = board[row][col].value;
      if (value !== null) {
        if (values.has(value)) {
          // Mark all cells with this value in this column as invalid
          for (let r = 0; r < 9; r++) {
            if (board[r][col].value === value) {
              newBoard[r][col].isValid = false;
            }
          }
        } else {
          values.add(value);
        }
      }
    }
  }

  // Check 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const values = new Set<CellValue>();
      for (let row = boxRow * 3; row < boxRow * 3 + 3; row++) {
        for (let col = boxCol * 3; col < boxCol * 3 + 3; col++) {
          const value = board[row][col].value;
          if (value !== null) {
            if (values.has(value)) {
              // Mark all cells with this value in this box as invalid
              for (let r = boxRow * 3; r < boxRow * 3 + 3; r++) {
                for (let c = boxCol * 3; c < boxCol * 3 + 3; c++) {
                  if (board[r][c].value === value) {
                    newBoard[r][c].isValid = false;
                  }
                }
              }
            } else {
              values.add(value);
            }
          }
        }
      }
    }
  }

  // Mark all cells that weren't marked as invalid as valid
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (newBoard[row][col].isValid === undefined && newBoard[row][col].value !== null) {
        newBoard[row][col].isValid = true;
      }
    }
  }

  return newBoard;
};

// Create the game context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

// Game provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Update elapsed time when game is active and not paused
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (state.isActive && !state.isPaused) {
      timer = setInterval(() => {
        dispatch({
          type: ActionType.UPDATE_TIME,
          elapsedTime: Date.now() - state.startTime,
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.isActive, state.isPaused, state.startTime]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => useContext(GameContext);