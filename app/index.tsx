import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameProvider } from '../src/context/GameContext';
import HomeScreen from '../src/screens/HomeScreen';

export default function Index() {
  return (
    <View style={styles.container}>
      <GameProvider>
        <HomeScreen />
      </GameProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
