import { StyleSheet } from 'react-native';
import type { AppColors } from '@/theme/appPalette';

/** Separa la distribución de los colores elegidos para toda la app. */
export const createStyles = (colors: AppColors) =>
    StyleSheet.create({
        root: { flex: 1, backgroundColor: colors.background },
        content: { padding: 20, gap: 12, paddingBottom: 32 },
        header: { gap: 14, marginBottom: 12 },
        title: { fontSize: 28, fontWeight: '800', color: colors.text },
        note: { color: colors.muted, fontSize: 13, lineHeight: 20 },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 8,
        },
        nameButton: { flex: 1, minHeight: 64, justifyContent: 'center', padding: 8, gap: 4 },
        name: { fontWeight: '700', color: colors.text, fontSize: 15 },
        arrow: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    });
