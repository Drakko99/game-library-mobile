import { useMemo } from 'react';
import { usePreferences } from '@/app/Preferences';
import type { AppColors } from './appPalette';

/** Recalcula los estilos de una pantalla únicamente cuando cambia su paleta. */
export function useThemedStyles<T>(factory: (colors: AppColors) => T): T {
    const { colors } = usePreferences();
    return useMemo(() => factory(colors), [colors, factory]);
}
