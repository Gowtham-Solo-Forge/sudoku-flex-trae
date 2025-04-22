import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import PreviewGrid from '../components/PreviewGrid';
import { useAuth } from '../context/AuthContext';
import { getUserPuzzles, deletePuzzle, PuzzleDocument } from '../services/firestore';
import Toast from 'react-native-toast-message';

// Using PuzzleDocument interface from firestore service

const HomeScreen: React.FC = () => {
  const [savedPuzzles, setSavedPuzzles] = useState<PuzzleDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const refreshing = useRef(false);

  useFocusEffect(
    React.useCallback(() => {
      if (user) {
        loadSavedPuzzles(false);
      }
    }, [user])
  );

  const loadSavedPuzzles = async (showLoadingIndicator = true) => {
    try {
      if (showLoadingIndicator) {
        setLoading(true);
      }
      refreshing.current = true;
      const puzzles = await getUserPuzzles();
      setSavedPuzzles(puzzles);
    } catch (error) {
      console.error('Error loading puzzles:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load puzzles'
      });
    } finally {
      setLoading(false);
      refreshing.current = false;
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeletePuzzle = async (id: string) => {
    try {
      await deletePuzzle(id);
      setSavedPuzzles(savedPuzzles.filter(puzzle => puzzle.id !== id));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Puzzle deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting puzzle:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete puzzle'
      });
    }
  };

  const renderItem = ({ item }: { item: PuzzleDocument }) => (
    <TouchableOpacity 
      style={styles.puzzleItem}
      onPress={() => router.push(`/solve/${item.id}`)}
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
                { text: 'Delete', style: 'destructive', onPress: () => handleDeletePuzzle(item.id) }
              ]
            );
          }}
        >
          <MaterialIcons name="delete" size={24} color="#444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleRefresh = () => {
    if (!refreshing.current) {
      loadSavedPuzzles(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Puzzles</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading puzzles...</Text>
        </View>
      ) : savedPuzzles.length === 0 ? (
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
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