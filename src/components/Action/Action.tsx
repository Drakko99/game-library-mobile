import type { ComponentProps } from 'react';
import {
    Pressable,
    type PressableStateCallbackType,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, {
    cubicBezier,
    useReducedMotion,
} from 'react-native-reanimated';

import { usePreferences } from '@/app/Preferences';
import { styles } from './Action.styles';

interface Props {
    label: string;
    icon: ComponentProps<typeof Ionicons>['name'];
    onPress: () => void;
}

const easing = cubicBezier(0.23, 1, 0.32, 1);

/** Botón con icono, etiqueta y respuesta breve a la pulsación. */
export function Action({ label, icon, onPress }: Props) {
    const { accent } = usePreferences();
    const reduced = useReducedMotion();

    /** Mantiene el área táctil fija mientras anima el contenido. */
    function renderContent({
        pressed,
    }: PressableStateCallbackType) {
        return (
            <Animated.View
                style={[
                    styles.content,
                    {
                        transform: [
                            { scale: pressed && !reduced ? 0.97 : 1 },
                        ],
                        transitionProperty: 'transform',
                        transitionDuration: reduced ? 0 : 120,
                        transitionTimingFunction: easing,
                    },
                ]}
            >
                <Ionicons name={icon} size={20} color={accent} />
                <Animated.Text style={styles.label}>
                    {label}
                </Animated.Text>
            </Animated.View>
        );
    }

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={label}
            onPress={onPress}
        >
            {renderContent}
        </Pressable>
    );
}