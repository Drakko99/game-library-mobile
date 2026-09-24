import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  PreferencesProvider,
  usePreferences,
} from '@/app/Preferences';
import { AppNavigator } from '@/app/navigation/AppNavigator';
import { styles } from './App.styles';

/** Espera a la lectura real de preferencias, sin un temporizador artificial. */
function AppContent() {
  const { ready } = usePreferences();

  return (
    <>
      <StatusBar style="light" />

      {ready ? (
        <AppNavigator />
      ) : (
        <View style={styles.loading}>
          <Text style={styles.brand}>Game Libary</Text>
        </View>
      )}
    </>
  );
}

/** Instala los proveedores comunes antes de montar las pantallas. */
export default function App() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <AppContent />
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}