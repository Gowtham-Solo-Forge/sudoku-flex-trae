import firestore, { Timestamp } from '@react-native-firebase/firestore';
import { Board, CellValue, Notes } from '../types';
import { firebaseAuth } from '../config/firebase';
import { CUSTOM_PUZZLES_COLLECTION } from '../utils/constants';

// Interface for puzzle document
export interface PuzzleDocument {
  id: string;
  board: Board;
  createdAt: Timestamp;
  userId: string;
}

// Interface for the flattened board data stored in Firestore
export interface FirestorePuzzleData {
  id: string;
  boardData: Record<string, {
    value: CellValue;
    notes: Notes;
    isInitial: boolean;
    isValid?: boolean;
  }>;
  createdAt: Timestamp;
  userId: string;
}

/**
 * Save a puzzle to Firestore
 * @param board The puzzle board to save
 * @returns The ID of the saved puzzle
 */
export const savePuzzle = async (board: Board): Promise<string> => {
  try {
    const userId = firebaseAuth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Convert the 2D board array to a flat structure that Firestore can handle
    // We'll use a map with string keys in the format 'row_col'
    const flattenedBoard: Record<string, any> = {};
    
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const key = `${rowIndex}_${colIndex}`;
        flattenedBoard[key] = {
          value: cell.value,
          notes: cell.notes,
          isInitial: cell.isInitial,
          isValid: cell.isValid || true
        };
      });
    });

    const puzzleRef = firestore().collection(CUSTOM_PUZZLES_COLLECTION).doc();
    const puzzleData = {
      id: puzzleRef.id,
      boardData: flattenedBoard, // Store the flattened board
      createdAt: firestore.Timestamp.now(),
      userId,
    };

    await puzzleRef.set(puzzleData);
    return puzzleRef.id;
  } catch (error) {
    console.error('Error saving puzzle to Firestore:', error);
    throw error;
  }
};

/**
 * Get all puzzles for the current user
 * @returns Array of puzzle documents
 */
export const getUserPuzzles = async (): Promise<PuzzleDocument[]> => {
  try {
    const userId = firebaseAuth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const puzzlesSnapshot = await firestore()
      .collection(CUSTOM_PUZZLES_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return puzzlesSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Convert the flattened board back to a 2D array
      const boardData = data.boardData || {};
      const board: Board = Array(9).fill(null).map(() =>
        Array(9).fill(null).map(() => ({
          value: null,
          notes: { corner: [], center: [] },
          isInitial: false,
          isValid: true
        }))
      );
      
      // Populate the board with the data from Firestore
      Object.keys(boardData).forEach(key => {
        const [rowIndex, colIndex] = key.split('_').map(Number);
        const cell = boardData[key];
        if (rowIndex >= 0 && rowIndex < 9 && colIndex >= 0 && colIndex < 9) {
          board[rowIndex][colIndex] = {
            value: cell.value,
            notes: cell.notes || { corner: [], center: [] },
            isInitial: cell.isInitial || false,
            isValid: cell.isValid || true
          };
        }
      });

      return {
        id: data.id,
        board,
        createdAt: data.createdAt,
        userId: data.userId
      } as PuzzleDocument;
    });
  } catch (error) {
    console.error('Error getting user puzzles from Firestore:', error);
    throw error;
  }
};

/**
 * Get a specific puzzle by ID
 * @param puzzleId The ID of the puzzle to get
 * @returns The puzzle document or null if not found
 */
export const getPuzzleById = async (puzzleId: string): Promise<PuzzleDocument | null> => {
  try {
    const puzzleDoc = await firestore()
      .collection(CUSTOM_PUZZLES_COLLECTION)
      .doc(puzzleId)
      .get();

    if (!puzzleDoc.exists) {
      return null;
    }

    const data = puzzleDoc.data();
    if (!data) return null;
    
    // Convert the flattened board back to a 2D array
    const boardData = data.boardData || {};
    const board: Board = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => ({
        value: null,
        notes: { corner: [], center: [] },
        isInitial: false,
        isValid: true
      }))
    );
    
    // Populate the board with the data from Firestore
    Object.keys(boardData).forEach(key => {
      const [rowIndex, colIndex] = key.split('_').map(Number);
      const cell = boardData[key];
      if (rowIndex >= 0 && rowIndex < 9 && colIndex >= 0 && colIndex < 9) {
        board[rowIndex][colIndex] = {
          value: cell.value,
          notes: cell.notes || { corner: [], center: [] },
          isInitial: cell.isInitial || false,
          isValid: cell.isValid || true
        };
      }
    });

    return {
      id: data.id,
      board,
      createdAt: data.createdAt,
      userId: data.userId
    } as PuzzleDocument;
  } catch (error) {
    console.error('Error getting puzzle from Firestore:', error);
    throw error;
  }
};

/**
 * Delete a puzzle by ID
 * @param puzzleId The ID of the puzzle to delete
 */
export const deletePuzzle = async (puzzleId: string): Promise<void> => {
  try {
    const userId = firebaseAuth.currentUser?.uid;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // First verify the puzzle belongs to the current user
    const puzzleDoc = await firestore()
      .collection(CUSTOM_PUZZLES_COLLECTION)
      .doc(puzzleId)
      .get();

    if (!puzzleDoc.exists) {
      throw new Error('Puzzle not found');
    }

    const puzzleData = puzzleDoc.data() as PuzzleDocument;
    if (puzzleData.userId !== userId) {
      throw new Error('Not authorized to delete this puzzle');
    }

    await firestore()
      .collection(CUSTOM_PUZZLES_COLLECTION)
      .doc(puzzleId)
      .delete();
  } catch (error) {
    console.error('Error deleting puzzle from Firestore:', error);
    throw error;
  }
};