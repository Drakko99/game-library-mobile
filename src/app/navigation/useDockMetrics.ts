import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Comparte dimensiones entre la barra y el espacio final de las listas. */
export function useDockMetrics() {
    const { width, fontScale } = useWindowDimensions();
    const insets = useSafeAreaInsets();

    const dockWidth = Math.min(
        352,
        width - insets.left - insets.right - 40,
    );

    const labels = fontScale <= 1.3 && dockWidth >= 300;
    const height = labels ? 68 : 60;
    const bottom = insets.bottom + 12;

    return {
        width: dockWidth,
        height,
        bottom,
        labels,
        bottomSpace: height + bottom + 24,
    };
}