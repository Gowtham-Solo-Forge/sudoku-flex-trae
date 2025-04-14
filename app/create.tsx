import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GameProvider } from '../src/context/GameContext';
import CreateScreen from '../src/screens/CreateScreen';

export default function Create() {
  return (
    <View style={styles.container}>
      <GameProvider>
        <CreateScreen />
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