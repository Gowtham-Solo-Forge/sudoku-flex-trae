import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { GameProvider } from '../../src/context/GameContext';

export default function HomeLayout() {
  return (
    <GameProvider>
      <Tabs screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialIcons name="add-box" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }: { color: string }) => (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </GameProvider>
  );
}