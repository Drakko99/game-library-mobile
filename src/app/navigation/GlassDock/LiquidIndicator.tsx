import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import Animated, {
    ReduceMotion,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { alpha } from '@/theme/theme';
import { styles } from './GlassDock.styles';

type Props = Readonly<{ index: number; cellWidth: number; accent: string }>;

/** Estira una cápsula entre dos posiciones que convergen al mismo destino. */
export function LiquidIndicator({ index, cellWidth, accent }: Props) {
    const initialReduced = useReducedMotion();
    const [reduced, setReduced] = useState(initialReduced);
    const front = useSharedValue(index);
    const back = useSharedValue(index);

    // El hook inicial no vuelve a renderizar al cambiar la preferencia del sistema.
    useEffect(() => {
        const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
        return () => listener.remove();
    }, []);

    useEffect(() => {
        if (reduced) {
            front.set(index);
            back.set(index);
            return;
        }
        // No reiniciamos a la pestaña anterior: cada muelle continúa desde donde está.
        // Guardamos índices y no píxeles, por lo que la geometría admite cambios de ancho.
        front.set(
            withSpring(index, {
                duration: 300,
                dampingRatio: 1,
                overshootClamping: true,
                reduceMotion: ReduceMotion.System,
            }),
        );
        back.set(
            withSpring(index, {
                duration: 400,
                dampingRatio: 1,
                overshootClamping: true,
                reduceMotion: ReduceMotion.System,
            }),
        );
    }, [index, reduced, front, back]);

    const motion = useAnimatedStyle(() => {
        const a = front.get();
        const b = back.get();
        const stretch = Math.min(Math.abs(a - b), 0.55);
        const center = (a + b) / 2;
        return {
            // Solo esta vista absoluta y sin hijos cambia de ancho; las pestañas no se recolocan.
            width: cellWidth * (1 + stretch),
            transform: [{ translateX: cellWidth * (center - stretch / 2) }],
        };
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                styles.selection,
                { backgroundColor: alpha(accent, 0.17), borderColor: alpha(accent, 0.6) },
                motion,
            ]}
        />
    );
}
