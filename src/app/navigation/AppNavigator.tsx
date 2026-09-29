import {
    DarkTheme,
    NavigationContainer,
} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useReducedMotion } from 'react-native-reanimated';

import { usePreferences } from '@/app/Preferences';
import { theme } from '@/theme/theme';

import { LibraryScreen } from '@/features/library/screens/LibraryScreen/LibraryScreen';
import { LibrarySettingsScreen } from '@/features/library/screens/LibrarySettingsScreen/LibrarySettingsScreen';
import { GameDetailsScreen } from '@/features/library/screens/GameDetailsScreen/GameDetailsScreen';
import { ExploreScreen } from '@/features/explore/screens/ExploreScreen/ExploreScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen/ProfileScreen';
import { UserSettingsScreen } from '@/features/profile/screens/UserSettingsScreen/UserSettingsScreen';
import { AppSettingsScreen } from '@/features/settings/screens/AppSettingsScreen/AppSettingsScreen';

import { GlassTargetsProvider } from './GlassTargets';
import { GlassDock } from './GlassDock/GlassDock';
import type {
    RootStackParams,
    TabParams,
} from './navigation.types';

import { styles } from './AppNavigator.styles';

const Stack = createNativeStackNavigator<RootStackParams>();
const Tabs = createBottomTabNavigator<TabParams>();

/** Cambia entre pantallas hermanas sin animar un desplazamiento de toda la página. */
function MainTabs() {
    return (
        <Tabs.Navigator
            tabBar={props => <GlassDock {...props} />}
            screenOptions={{
                headerShown: false,
                animation: 'none',
                tabBarStyle: styles.hiddenDefaultBar,
            }}
        >
            <Tabs.Screen
                name="Library"
                component={LibraryScreen}
            />

            <Tabs.Screen
                name="Explore"
                component={ExploreScreen}
            />

            <Tabs.Screen
                name="Profile"
                component={ProfileScreen}
            />

            <Tabs.Screen
                name="AppSettings"
                component={AppSettingsScreen}
            />
        </Tabs.Navigator>
    );
}

/** Mantiene el historial nativo y separa las tres áreas de configuración. */
export function AppNavigator() {
    const { accent } = usePreferences();
    const reduced = useReducedMotion();

    return (
        <GlassTargetsProvider>
            <NavigationContainer
                theme={{
                    ...DarkTheme,
                    colors: {
                        ...DarkTheme.colors,
                        primary: accent,
                        background: theme.background,
                        card: theme.surface,
                        text: theme.text,
                        border: theme.border,
                    },
                }}
            >
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: styles.scene,
                        animation: reduced ? 'none' : 'default',
                    }}
                >
                    <Stack.Screen
                        name="Main"
                        component={MainTabs}
                    />

                    <Stack.Screen
                        name="Game"
                        component={GameDetailsScreen}
                    />

                    <Stack.Screen
                        name="UserSettings"
                        component={UserSettingsScreen}
                    />

                    <Stack.Screen
                        name="LibrarySettings"
                        component={LibrarySettingsScreen}
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: [0.85, 1],
                            sheetCornerRadius: 28,
                            sheetGrabberVisible: true,
                            contentStyle: styles.sheet,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GlassTargetsProvider>
    );
}