import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { BlurTargetView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { TabParams } from '@/app/navigation/navigation.types';
import { useGlassTargets } from '@/app/navigation/GlassTargets';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { createStyles } from './TabCanvas.styles';

/** Incluye el fondo del tema DENTRO del contenido que captura el desenfoque. */
export function TabCanvas({
    tab,
    children,
}: Readonly<PropsWithChildren<{ tab: keyof TabParams }>>) {
    const styles = useThemedStyles(createStyles);
    const targets = useGlassTargets();

    return (
        <BlurTargetView ref={targets[tab]} style={styles.fill}>
            <View style={styles.canvas} collapsable={false}>
                <SafeAreaView edges={['top', 'left', 'right']} style={styles.fill}>
                    {children}
                </SafeAreaView>
            </View>
        </BlurTargetView>
    );
}