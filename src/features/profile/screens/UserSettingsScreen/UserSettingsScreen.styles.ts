import { StyleSheet } from 'react-native';
import type { AppColors } from '@/theme/appPalette';

/** Deriva los estilos de la paleta activa de la aplicación. */
export const createStyles = (theme: AppColors) =>
    StyleSheet.create({
        root: {
            flex: 1,
            backgroundColor: theme.background,
        },

        input: {
            minHeight: 52,
            borderWidth: 1,
            borderRadius: 16,
            padding: 14,
            backgroundColor: theme.surface,
            color: theme.text,
            fontSize: 16,
        },
    });