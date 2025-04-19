import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import PreviewGrid from '../components/PreviewGrid';
import { useAuth } from '../context/AuthContext';

interface SavedPuzzle {
  id: string;
  board: any[][];
  createdAt: string;
}

const HomeScreen: React.FC = () => {
  const [savedPuzzles, setSavedPuzzles] = useState<SavedPuzzle[]>([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      loadSavedPuzzles();
    }, [])
  );

  const loadSavedPuzzles = async () => {
    try {
      const puzzlesJson = await AsyncStorage.getItem('savedPuzzles');
      if (puzzlesJson) {
        const puzzles = JSON.parse(puzzlesJson);
        setSavedPuzzles(puzzles.sort((a: SavedPuzzle, b: SavedPuzzle) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading puzzles:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const deletePuzzle = async (id: string) => {
    try {
      const updatedPuzzles = savedPuzzles.filter(puzzle => puzzle.id !== id);
      await AsyncStorage.setItem('savedPuzzles', JSON.stringify(updatedPuzzles));
      setSavedPuzzles(updatedPuzzles);
    } catch (error) {
      console.error('Error deleting puzzle:', error);
      Alert.alert('Error', 'Failed to delete puzzle');
    }
  };

  const renderItem = ({ item }: { item: SavedPuzzle }) => (
    <TouchableOpacity 
      style={styles.puzzleItem}
      onPress={() => router.push(`/game/${item.id}`)}
    >
      <View style={styles.puzzleContent}>
        <PreviewGrid board={item.board} />
        <View style={styles.puzzleInfo}>
          <Text style={styles.puzzleTitle}>Puzzle #{item.id.slice(-4)}</Text>
          <Text style={styles.puzzleDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Delete Puzzle',
              'Are you sure you want to delete this puzzle?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deletePuzzle(item.id) }
              ]
            );
          }}
        >
          <MaterialIcons name="delete" size={24} color="#444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Puzzles</Text>
      
      {savedPuzzles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No puzzles created yet</Text>
          <Text style={styles.emptySubText}>Go to Create tab to make your first puzzle!</Text>
        </View>
      ) : (
        <FlatList
          data={savedPuzzles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  puzzleItem: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  puzzleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  puzzleInfo: {
    marginLeft: 15,
    flex: 1,
  },
  puzzleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  puzzleDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  deleteButton: {
    // backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 50,
  },
});

export default HomeScreen;