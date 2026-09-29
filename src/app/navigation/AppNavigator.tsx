import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useReducedMotion } from 'react-native-reanimated';
import { usePreferences } from '@/app/Preferences';
import { LibraryScreen } from '@/features/library/screens/LibraryScreen/LibraryScreen';
import { LibrarySettingsScreen } from '@/features/library/screens/LibrarySettingsScreen/LibrarySettingsScreen';
import { LibraryOrderScreen } from '@/features/library/screens/LibraryOrderScreen/LibraryOrderScreen';
import { GameDetailsScreen } from '@/features/library/screens/GameDetailsScreen/GameDetailsScreen';
import { ExploreScreen } from '@/features/explore/screens/ExploreScreen/ExploreScreen';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen/ProfileScreen';
import { UserSettingsScreen } from '@/features/profile/screens/UserSettingsScreen/UserSettingsScreen';
import { AppSettingsScreen } from '@/features/settings/screens/AppSettingsScreen/AppSettingsScreen';
import { GlassTargetsProvider } from './GlassTargets';
import { GlassDock } from './GlassDock/GlassDock';
import type { RootStackParams, TabParams } from './navigation.types';
import { styles } from './AppNavigator.styles';

const Stack = createNativeStackNavigator<RootStackParams>();
const Tabs = createBottomTabNavigator<TabParams>();

/** Conserva el componente de navegación entre cambios de pestaña. */
function renderDock(props: BottomTabBarProps) {
    return <GlassDock {...props} />;
}

/** Las pantallas cambian inmediatamente; solo se anima su indicador de selección. */
function MainTabs() {
    return (
        <Tabs.Navigator
            tabBar={renderDock}
            screenOptions={{
                headerShown: false,
                animation: 'none',
                tabBarStyle: styles.hiddenDefaultBar,
            }}
        >
            <Tabs.Screen name="Library" component={LibraryScreen} />
            <Tabs.Screen name="Explore" component={ExploreScreen} />
            <Tabs.Screen name="Profile" component={ProfileScreen} />
            <Tabs.Screen name="AppSettings" component={AppSettingsScreen} />
        </Tabs.Navigator>
    );
}

/** Registra cada pantalla y transmite la paleta a la navegación nativa. */
export function AppNavigator() {
    const { accent, colors } = usePreferences();
    const reduced = useReducedMotion();
    return (
        <GlassTargetsProvider>
            <NavigationContainer
                theme={{
                    ...DarkTheme,
                    dark: colors.dark,
                    colors: {
                        ...DarkTheme.colors,
                        primary: accent,
                        background: colors.background,
                        card: colors.surface,
                        text: colors.text,
                        border: colors.border,
                    },
                }}
            >
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        contentStyle: [styles.scene, { backgroundColor: colors.background }],
                        animation: reduced ? 'none' : 'default',
                    }}
                >
                    <Stack.Screen name="Main" component={MainTabs} />
                    <Stack.Screen name="Game" component={GameDetailsScreen} />
                    <Stack.Screen name="LibraryOrder" component={LibraryOrderScreen} />
                    <Stack.Screen name="UserSettings" component={UserSettingsScreen} />
                    <Stack.Screen
                        name="LibrarySettings"
                        component={LibrarySettingsScreen}
                        options={{
                            presentation: 'formSheet',
                            sheetAllowedDetents: [0.85, 1],
                            sheetCornerRadius: 28,
                            sheetGrabberVisible: true,
                            contentStyle: [styles.sheet, { backgroundColor: colors.background }],
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </GlassTargetsProvider>
    );
}