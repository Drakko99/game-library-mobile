import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  PreferencesProvider,
  usePreferences,
} from '@/app/Preferences';

import {
  LocalProfileProvider,
  useLocalProfile,
} from '@/features/profile/LocalProfile';

import { AppNavigator } from '@/app/navigation/AppNavigator';
import { styles } from './App.styles';

/** Espera a la lectura real de los dos estados persistidos. */
function AppContent() {
  const appearance = usePreferences();
  const profile = useLocalProfile();

  return (
    <>
      <StatusBar style="light" />

      {appearance.ready && profile.ready ? (
        <AppNavigator />
      ) : (
        <View style={styles.loading}>
          <Text style={styles.brand}>Game Libary</Text>
        </View>
      )}
    </>
  );
}

/** Proporciona áreas seguras, apariencia y perfil a toda la navegación. */
export default function App() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <LocalProfileProvider>
          <AppContent />
        </LocalProfileProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}