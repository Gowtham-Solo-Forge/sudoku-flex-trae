import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GameProvider } from '../src/context/GameContext';
import Toast, { BaseToast, ErrorToast, SuccessToast } from 'react-native-toast-message';

export default function AppLayout() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
            name="game/[id]"
            options={{
              title: 'Solve',
              tabBarIcon: ({ color }: { color: string }) => (
                <MaterialIcons name="videogame-asset" size={24} color={color} />
              ),
            }}
          />
        </Tabs>
      </GestureHandlerRootView>
      <Toast 
        position='bottom'
        visibilityTime={1500}
        config={{
          success: ({ text1, text2 }) => (
            <SuccessToast
              text1={text1}
              text2={text2}
            />
          ),
          error: ({ text1, text2 }) => (
            <ErrorToast
              text1={text1}
              text2={text2}
            />
          ),
          info: ({ text1, text2 }) => (
            <BaseToast
              text1={text1}
              text2={text2}
            />
          ),
        }}
      />
    </>
  );
}
