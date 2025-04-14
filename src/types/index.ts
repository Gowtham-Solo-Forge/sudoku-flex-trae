// Define types for the Sudoku game

// Cell value can be 1-9 or null (empty)
export type CellValue = number | null;

// Notes can be in corner or center
export type Notes = {
  corner: number[];
  center: number[];
};

// Game modes
export enum GameMode {
  NORMAL = 'normal',
  CORNER_NOTES = 'corner',
  CENTER_NOTES = 'center',
}

// Cell represents a single Sudoku cell
export type Cell = {
  value: CellValue;
  notes: Notes;
  isInitial: boolean; // Whether the cell was part of the initial puzzle
  isValid?: boolean; // For validation highlighting
};

// Board is a 9x9 grid of cells
export type Board = Cell[][];

// Game state
export type GameState = {
  board: Board;
  initialBoard: Board;
  mode: GameMode;
  history: Board[];
  historyIndex: number;
  startTime: number;
  elapsedTime: number;
  isActive: boolean;
  isPaused: boolean;
};

// Action types for game state reducer
export enum ActionType {
  SET_VALUE = 'SET_VALUE',
  SET_NOTES = 'SET_NOTES',
  SET_MODE = 'SET_MODE',
  UNDO = 'UNDO',
  REDO = 'REDO',
  VALIDATE = 'VALIDATE',
  START_GAME = 'START_GAME',
  RESET_GAME = 'RESET_GAME',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  UPDATE_TIME = 'UPDATE_TIME',
  CLEAR_CELL = 'CLEAR_CELL',
}

// Actions for game state reducer
export type Action =
  | { type: ActionType.SET_VALUE; row: number; col: number; value: CellValue }
  | { type: ActionType.SET_NOTES; row: number; col: number; noteType: 'corner' | 'center'; value: number }
  | { type: ActionType.SET_MODE; mode: GameMode }
  | { type: ActionType.UNDO }
  | { type: ActionType.REDO }
  | { type: ActionType.VALIDATE }
  | { type: ActionType.START_GAME; initialBoard: Board }
  | { type: ActionType.PAUSE_GAME }
  | { type: ActionType.RESUME_GAME }
  | { type: ActionType.UPDATE_TIME; elapsedTime: number }
  | { type: ActionType.CLEAR_CELL; row: number; col: number }
  | { type: ActionType.RESET_GAME };