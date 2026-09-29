import { useEffect, useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
    cubicBezier,
    useReducedMotion,
} from 'react-native-reanimated';

import { usePreferences } from '@/app/Preferences';
import { theme, alpha } from '@/theme/theme';
import { useGlassTargets } from '../GlassTargets';
import { useDockMetrics } from '../useDockMetrics';
import type { TabParams } from '../navigation.types';
import { styles } from './GlassDock.styles';

type Icon = React.ComponentProps<typeof Ionicons>['name'];

const entries: Record<
    keyof TabParams,
    { label: string; icon: Icon; active: Icon }
> = {
    Library: {
        label: 'Biblioteca',
        icon: 'library-outline',
        active: 'library',
    },
    Explore: {
        label: 'Explorar',
        icon: 'compass-outline',
        active: 'compass',
    },
    Profile: {
        label: 'Perfil',
        icon: 'person-outline',
        active: 'person',
    },
    AppSettings: {
        label: 'Ajustes',
        icon: 'settings-outline',
        active: 'settings',
    },
};

/** Dibuja una barra flotante; React Navigation sigue gestionando las rutas. */
export function GlassDock({
    state,
    navigation,
}: BottomTabBarProps) {
    const { accent, preferences } = usePreferences();
    const targets = useGlassTargets();
    const metrics = useDockMetrics();
    const reduced = useReducedMotion();

    const [keyboard, setKeyboard] = useState(false);

    const activeRoute = state.routes[state.index];
    const tab = activeRoute.name as keyof TabParams;

    const cellWidth =
        (metrics.width - 12) / state.routes.length;

    useEffect(() => {
        const show = Keyboard.addListener(
            'keyboardDidShow',
            () => setKeyboard(true),
        );

        const hide = Keyboard.addListener(
            'keyboardDidHide',
            () => setKeyboard(false),
        );

        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    if (keyboard) return null;

    return (
        <View
            pointerEvents="box-none"
            style={[styles.host, { bottom: metrics.bottom }]}
        >
            <View
                style={[
                    styles.shadow,
                    {
                        width: metrics.width,
                        height: metrics.height,
                    },
                ]}
            >
                <View style={styles.clip}>
                    {preferences.glass && (
                        <BlurView
                            key={activeRoute.key}
                            blurTarget={targets[tab]}
                            blurMethod="dimezisBlurViewSdk31Plus"
                            intensity={45}
                            tint="dark"
                            style={styles.fill}
                            pointerEvents="none"
                        />
                    )}

                    {/* El tinte se dibuja SOBRE el blur, sin depender de su fondo nativo. */}
                    <View
                        pointerEvents="none"
                        style={[
                            styles.fill,
                            {
                                backgroundColor: preferences.glass
                                    ? '#0C0D10A8'
                                    : '#141518',
                            },
                        ]}
                    />

                    <LinearGradient
                        pointerEvents="none"
                        style={styles.fill}
                        colors={[
                            '#FFFFFF19',
                            '#FFFFFF03',
                            '#00000020',
                        ]}
                        locations={[0, 0.45, 1]}
                    />

                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.selection,
                            {
                                width: cellWidth,
                                backgroundColor: alpha(accent, 0.17),
                                borderColor: alpha(accent, 0.45),
                                transform: [
                                    {
                                        translateX: cellWidth * state.index,
                                    },
                                ],
                                transitionProperty: 'transform',
                                transitionDuration: reduced ? 0 : 180,
                                transitionTimingFunction: cubicBezier(
                                    0.77,
                                    0,
                                    0.175,
                                    1,
                                ),
                            },
                        ]}
                    />

                    <View style={styles.items}>
                        {state.routes.map((route, index) => {
                            const selected = state.index === index;
                            const entry =
                                entries[route.name as keyof TabParams];

                            /** Emite el evento estándar antes de cambiar de pestaña. */
                            function select() {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                                if (!selected && !event.defaultPrevented) {
                                    navigation.navigate(
                                        route.name,
                                        route.params,
                                    );
                                }
                            }

                            return (
                                <Pressable
                                    key={route.key}
                                    onPress={select}
                                    onLongPress={() =>
                                        navigation.emit({
                                            type: 'tabLongPress',
                                            target: route.key,
                                        })
                                    }
                                    accessibilityRole="tab"
                                    accessibilityLabel={entry.label}
                                    accessibilityState={{ selected }}
                                    style={styles.item}
                                >
                                    {({ pressed }) => (
                                        <View
                                            style={[
                                                styles.itemContent,
                                                { opacity: pressed ? 0.65 : 1 },
                                            ]}
                                        >
                                            <Ionicons
                                                name={
                                                    selected
                                                        ? entry.active
                                                        : entry.icon
                                                }
                                                size={23}
                                                color={
                                                    selected ? accent : '#D0D0D5'
                                                }
                                            />

                                            {metrics.labels && (
                                                <Text
                                                    style={[
                                                        styles.label,
                                                        {
                                                            color: selected
                                                                ? theme.text
                                                                : '#C0C0C7',
                                                            fontWeight: selected
                                                                ? '700'
                                                                : '500',
                                                        },
                                                    ]}
                                                >
                                                    {entry.label}
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                </Pressable>
                            );
                        })}
                    </View>

                    <View pointerEvents="none" style={styles.rim} />
                </View>
            </View>
        </View>
    );
}