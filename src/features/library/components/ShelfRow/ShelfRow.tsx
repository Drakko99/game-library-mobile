import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { usePreferences } from '@/app/Preferences';
import { alpha } from '@/theme/theme';
import { shelfMaterials } from './shelfMaterials';
import { styles } from './ShelfRow.styles';

type Props = PropsWithChildren<Readonly<{ gap?: number; sidePadding?: number }>>;

/** Dibuja vetas estables, sin descargar texturas ni generar ruido en cada renderizado. */
function WoodGrain() {
    return (
        <View pointerEvents="none" style={styles.grain}>
            {[7, 18, 23, 39, 52, 58, 77, 91].map((top, index) => (
                <View
                    key={top}
                    style={[
                        styles.grainLine,
                        { top: `${top}%`, transform: [{ rotate: `${index % 2 === 0 ? 0.7 : -0.5}deg` }] },
                    ]}
                />
            ))}
        </View>
    );
}

/** Construye cada hueco con el mismo material en trasera, laterales y balda. */
export function ShelfRow({ children, gap = 12, sidePadding = 20 }: Props) {
    const { preferences, accent } = usePreferences();
    const material = shelfMaterials[preferences.finish];
    const light = preferences.light === 'warm' ? '#FFD39A' : accent;
    const lit = preferences.light !== 'off';

    return (
        <View style={{ backgroundColor: material.back }}>
            <View style={styles.niche}>
                {material.wood && <WoodGrain />}
                <LinearGradient
                    pointerEvents="none"
                    colors={['#00000066', '#00000000']}
                    style={styles.ceilingShadow}
                />
                {lit && (
                    <LinearGradient
                        pointerEvents="none"
                        colors={[alpha(light, 0.16), alpha(light, 0)]}
                        style={styles.lighting}
                    />
                )}
                {[25, 50, 75].map((left) => (
                    <View key={left} pointerEvents="none" style={[styles.seam, { left: `${left}%` }]} />
                ))}
                <View style={[styles.books, { gap, paddingHorizontal: sidePadding }]}>{children}</View>
                <LinearGradient
                    pointerEvents="none"
                    colors={[material.rail, material.edge]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.leftRail}
                />
                <LinearGradient
                    pointerEvents="none"
                    colors={[material.edge, material.rail]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.rightRail}
                />
            </View>
            {preferences.shelves && (
                <View>
                    <View style={[styles.top, { backgroundColor: material.top }]} />
                    <LinearGradient colors={[material.front, material.edge]} style={styles.front}>
                        {material.wood && <WoodGrain />}
                        {lit && (
                            <View
                                style={[
                                    styles.led,
                                    {
                                        backgroundColor: light,
                                        boxShadow: preferences.neon ? `0 0 10px ${alpha(light, 0.6)}` : 'none',
                                    },
                                ]}
                            />
                        )}
                    </LinearGradient>
                </View>
            )}
        </View>
    );
}