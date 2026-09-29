import { useEffect, useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { usePreferences } from '@/app/Preferences';
import { alpha } from '@/theme/theme';
import { useGlassTargets } from '../GlassTargets';
import { useDockMetrics } from '../useDockMetrics';
import type { TabParams } from '../navigation.types';
import { LiquidIndicator } from './LiquidIndicator';
import { styles } from './GlassDock.styles';

type Icon = React.ComponentProps<typeof Ionicons>['name'];
const entries: Record<
    keyof TabParams,
    Readonly<{
        label: string;
        icon: Icon;
        active: Icon;
    }>
> = {
    Library: { label: 'Biblioteca', icon: 'library-outline', active: 'library' },
    Explore: { label: 'Explorar', icon: 'compass-outline', active: 'compass' },
    Profile: { label: 'Perfil', icon: 'person-outline', active: 'person' },
    AppSettings: { label: 'Ajustes', icon: 'settings-outline', active: 'settings' },
};

/** Mantiene un único indicador móvil mientras React Navigation cambia de pantalla. */
export function GlassDock({ state, navigation }: Readonly<BottomTabBarProps>) {
    const { accent, colors, preferences } = usePreferences();
    const targets = useGlassTargets();
    const metrics = useDockMetrics();
    const [keyboard, setKeyboard] = useState(false);
    const activeRoute = state.routes[state.index];
    const tab = activeRoute.name as keyof TabParams;
    const cellWidth = (metrics.width - 12) / state.routes.length;

    // Ocultamos la barra al escribir; no intentamos imitar el movimiento del teclado.
    useEffect(() => {
        const show = Keyboard.addListener('keyboardDidShow', () => setKeyboard(true));
        const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    if (keyboard) return null;

    return (
        <View pointerEvents="box-none" style={[styles.host, { bottom: metrics.bottom }]}>
            <View style={[styles.shadow, { width: metrics.width, height: metrics.height }]}>
                <View style={styles.clip}>
                    {preferences.glass && (
                        <BlurView
                            key={activeRoute.key}
                            blurTarget={targets[tab]}
                            blurMethod="dimezisBlurViewSdk31Plus"
                            intensity={45}
                            tint={colors.dark ? 'dark' : 'light'}
                            style={styles.fill}
                            pointerEvents="none"
                        />
                    )}
                    {/* El color sobre el blur evita depender del fondo nativo de Android. */}
                    <View
                        pointerEvents="none"
                        style={[
                            styles.fill,
                            {
                                backgroundColor: preferences.glass ? alpha(colors.surface, 0.76) : colors.surface,
                            },
                        ]}
                    />
                    <LinearGradient
                        pointerEvents="none"
                        style={styles.fill}
                        colors={
                            colors.dark
                                ? ['#FFFFFF19', '#FFFFFF03', '#00000020']
                                : ['#FFFFFF99', '#FFFFFF08', '#0000000D']
                        }
                        locations={[0, 0.45, 1]}
                    />

                    {/* No lleva key por ruta: conserva su posición durante cada navegación. */}
                    <LiquidIndicator index={state.index} cellWidth={cellWidth} accent={accent} />

                    <View style={styles.items}>
                        {state.routes.map((route, index) => {
                            const selected = state.index === index;
                            const entry = entries[route.name as keyof TabParams];

                            /** Permite que los listeners cancelen el cambio de pestaña. */
                            function select() {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });
                                if (!selected && !event.defaultPrevented) {
                                    navigation.navigate(route.name, route.params);
                                }
                            }

                            /** Conserva el evento estándar de pulsación prolongada. */
                            function longPress() {
                                navigation.emit({ type: 'tabLongPress', target: route.key });
                            }

                            return (
                                <Pressable
                                    key={route.key}
                                    onPress={select}
                                    onLongPress={longPress}
                                    accessibilityRole="tab"
                                    accessibilityLabel={entry.label}
                                    accessibilityState={{ selected }}
                                    style={styles.item}
                                >
                                    {({ pressed }) => (
                                        <View style={[styles.itemContent, { opacity: pressed ? 0.65 : 1 }]}>
                                            <Ionicons
                                                name={selected ? entry.active : entry.icon}
                                                size={23}
                                                color={selected ? accent : colors.muted}
                                            />
                                            {metrics.labels && (
                                                <Text
                                                    style={[
                                                        styles.label,
                                                        {
                                                            color: selected ? colors.text : colors.muted,
                                                            fontWeight: selected ? '700' : '500',
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
                    <View
                        pointerEvents="none"
                        style={[
                            styles.rim,
                            {
                                borderColor: colors.border,
                                borderTopColor: colors.dark ? '#FFFFFF50' : '#FFFFFFDD',
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
}