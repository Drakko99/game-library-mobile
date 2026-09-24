import { useWindowDimensions } from 'react-native';
import {
    NavigationContainer,
    DarkTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useReducedMotion } from 'react-native-reanimated';

import { usePreferences } from '@/app/Preferences';
import { theme, alpha } from '@/theme/theme';
import { LibraryScreen } from '@/features/library/screens/LibraryScreen/LibraryScreen';
import { GameDetailsScreen } from '@/features/library/screens/GameDetailsScreen/GameDetailsScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen/ProfileScreen';
import { CustomizeScreen } from '@/features/settings/screens/CustomizeScreen/CustomizeScreen';
import {
    GlassTargetsProvider,
    useGlassTargets,
} from './GlassTargets';
import type {
    RootStackParams,
    TabParams,
} from './navigation.types';
import { styles } from './AppNavigator.styles';

const Stack = createNativeStackNavigator<RootStackParams>();
const Tabs = createBottomTabNavigator<TabParams>();

/** Mantiene las pestañas y dibuja su barra glass sobre el contenido. */
function MainTabs() {
    const { preferences, accent } = usePreferences();
    const targets = useGlassTargets();
    const insets = useSafeAreaInsets();
    const { fontScale } = useWindowDimensions();

    return (
        <Tabs.Navigator
            safeAreaInsets={{ bottom: 0 }}
            screenOptions={({ route }) => ({
                headerShown: false,
                animation: 'none',
                tabBarHideOnKeyboard: true,
                tabBarActiveTintColor: accent,
                tabBarInactiveTintColor: theme.muted,
                tabBarLabelPosition: 'below-icon',
                tabBarItemStyle: styles.tabItem,

                tabBarStyle: [
                    styles.tabBar,
                    {
                        bottom: insets.bottom + 12,
                        height: 48 + 20 * fontScale,
                        borderColor: preferences.neon
                            ? alpha(accent, 0.5)
                            : theme.border,
                    },
                ],

                // El desenfoque apunta a la pantalla activa y no incluye la barra.
                tabBarBackground: () => (
                    <BlurView
                        blurTarget={targets[route.name]}
                        blurMethod="dimezisBlurViewSdk31Plus"
                        intensity={40}
                        tint="dark"
                        style={styles.glass}
                    />
                ),

                tabBarIcon: ({ color, focused }) => (
                    <Ionicons
                        name={
                            route.name === 'Library'
                                ? 'library-outline'
                                : 'person-outline'
                        }
                        size={23}
                        color={color}
                        style={
                            focused && preferences.neon
                                ? {
                                    textShadowColor: accent,
                                    textShadowRadius: 12,
                                    textShadowOffset: {
                                        width: 0,
                                        height: 0,
                                    },
                                }
                                : undefined
                        }
                    />
                ),
            })}
        >
            <Tabs.Screen
                name="Library"
                component={LibraryScreen}
                options={{ title: 'Biblioteca' }}
            />

            <Tabs.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Perfil' }}
            />
        </Tabs.Navigator>
    );
}

/** Gestiona historial, Atrás, fichas y la hoja de personalización. */
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
                        name="Customize"
                        component={CustomizeScreen}
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: [0.8, 1],
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