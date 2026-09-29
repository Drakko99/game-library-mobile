import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { usePreferences } from '@/app/Preferences';
import { alpha } from '@/theme/theme';
import { shelfMaterials } from './shelfMaterials';
import { styles } from './ShelfRow.styles';

/** Construye un hueco de estantería: trasera, luz, soportes y frente de balda. */
export function ShelfRow({ children }: PropsWithChildren) {
    const { preferences, accent } = usePreferences();

    const material = shelfMaterials[preferences.finish];
    const light =
        preferences.light === 'warm' ? '#FFD39A' : accent;

    const lit = preferences.light !== 'off';

    return (
        <View style={{ backgroundColor: material.back }}>
            <View style={styles.niche}>
                <LinearGradient
                    pointerEvents="none"
                    colors={['#000000AA', '#00000000']}
                    style={styles.ceilingShadow}
                />

                {lit && (
                    <LinearGradient
                        pointerEvents="none"
                        colors={[
                            alpha(light, 0.16),
                            alpha(light, 0),
                        ]}
                        style={styles.lighting}
                    />
                )}

                {/* Los paneles son discretos para que el material siga viéndose. */}
                {[25, 50, 75].map(left => (
                    <View
                        key={left}
                        pointerEvents="none"
                        style={[
                            styles.seam,
                            { left: `${left}%` },
                        ]}
                    />
                ))}

                <View style={styles.books}>{children}</View>

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
                    <View
                        style={[
                            styles.top,
                            { backgroundColor: material.top },
                        ]}
                    />

                    <LinearGradient
                        colors={[material.front, material.edge]}
                        style={styles.front}
                    >
                        {lit && (
                            <View
                                style={[
                                    styles.led,
                                    {
                                        backgroundColor: light,
                                        boxShadow: preferences.neon
                                            ? `0 0 10px ${alpha(light, 0.6)}`
                                            : 'none',
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