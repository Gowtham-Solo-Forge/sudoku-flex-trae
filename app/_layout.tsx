import { Slot, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/context/ThemeContext';
import Toast, { BaseToast, ErrorToast, SuccessToast } from 'react-native-toast-message';

function RootLayoutNav() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to the login page if user is not authenticated
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to the home page if user is authenticated and trying to access auth pages
      router.replace('/(home)');
    }
  }, [user, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <RootLayoutNav />
        </ThemeProvider>
      </AuthProvider>
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
    </GestureHandlerRootView>
  );
}
