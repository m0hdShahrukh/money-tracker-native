import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { PaperProvider } from 'react-native-paper';
import AppNavigator from './app/navigation';
import { theme } from './app/theme';
import NavigationErrorBoundary from './components/NavigationErrorBoundary';
import AccountsProvider from './context/AccountsContext';
import AuthProvider from './context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function AppRoot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait just a moment then hide splash screen
    setTimeout(async () => {
      setReady(true);
      await SplashScreen.hideAsync();
    }, 100);
  }, []);

  if (!ready) return null;

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AccountsProvider>
          <NavigationErrorBoundary>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </NavigationErrorBoundary>
        </AccountsProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
