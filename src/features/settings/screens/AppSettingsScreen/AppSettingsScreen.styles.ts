import { StyleSheet } from 'react-native';
import type { AppColors } from '@/theme/appPalette';

/** Presenta temas en tarjetas adaptables y un editor de colores separado. */
export const createStyles = (colors: AppColors) =>
    StyleSheet.create({
        themes: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
        card: {
            flexBasis: 145,
            flexGrow: 1,
            padding: 12,
            borderWidth: 2,
            borderRadius: 20,
            backgroundColor: colors.surface,
            gap: 12,
        },
        preview: {
            minHeight: 90,
            borderRadius: 12,
            padding: 14,
            gap: 12,
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: colors.border,
        },
        sampleLine: { height: 8, width: '65%', borderRadius: 4 },
        sampleButton: { width: 30, height: 24, borderRadius: 8 },
        labelRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
        label: { flexShrink: 1, color: colors.text, fontWeight: '700', fontSize: 14 },
        input: {
            minHeight: 50,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 14,
            backgroundColor: colors.surface,
            color: colors.text,
            padding: 14,
            fontSize: 16,
        },
    });