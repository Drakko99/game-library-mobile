import { StyleSheet } from 'react-native';
import type { AppColors } from '@/theme/appPalette';

/** Distribuye la biblioteca usando la paleta activa. */
export const createStyles = (theme: AppColors) =>
    StyleSheet.create({
        content: {
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: 14,
            gap: 12,
            maxWidth: 900,
            width: '100%',
            alignSelf: 'center',
        },

        brand: {
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 2,
        },

        heading: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },

        flex: { flex: 1 },
        toolbar: { flexDirection: 'row', gap: 10 },

        title: {
            color: theme.text,
            fontSize: 32,
            fontWeight: '800',
            letterSpacing: -1,
        },

        caption: {
            color: theme.muted,
            fontSize: 12,
            marginTop: 4,
        },

        search: {
            minHeight: 48,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 18,
            color: theme.text,
            fontSize: 14,
        },

        filters: { gap: 8 },

        chip: {
            minHeight: 48,
            paddingHorizontal: 14,
            justifyContent: 'center',
            borderRadius: 24,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
        },

        chipText: {
            fontSize: 13,
            fontWeight: '600',
        },
    });