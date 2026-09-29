import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { BlurTargetView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { TabParams } from '@/app/navigation/navigation.types';
import { useGlassTargets } from '@/app/navigation/GlassTargets';
import { styles } from './TabCanvas.styles';

/** Incluye el fondo negro DENTRO del contenido que captura el desenfoque. */
export function TabCanvas({
    tab,
    children,
}: PropsWithChildren<{ tab: keyof TabParams }>) {
    const targets = useGlassTargets();

    return (
        <BlurTargetView ref={targets[tab]} style={styles.fill}>
            <View style={styles.canvas} collapsable={false}>
                <SafeAreaView
                    edges={['top', 'left', 'right']}
                    style={styles.fill}
                >
                    {children}
                </SafeAreaView>
            </View>
        </BlurTargetView>
    );
}