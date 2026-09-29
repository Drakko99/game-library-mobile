import { StyleSheet } from 'react-native';
import type { AppColors } from '@/theme/appPalette';

/** Deriva los estilos de la paleta activa de la aplicación. */
export const createStyles = (theme: AppColors) =>
    StyleSheet.create({
        fill: {
            flex: 1,
        },

        canvas: {
            flex: 1,
            backgroundColor: theme.background,
        },
    });
