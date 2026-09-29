import { StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    container: { flex: 1 },

    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 14,
    },

    cell: { flex: 1, minWidth: 0 },
    cover: { width: '100%' },
    listCover: { width: 68 },

    grid: {
        backgroundColor: theme.surface,
        padding: 8,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },

    list: {
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        borderRadius: 18,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
    },

    metadata: {
        flex: 1,
        padding: 6,
        gap: 6,
        justifyContent: 'center',
    },

    title: {
        color: theme.text,
        fontSize: 15,
        fontWeight: '700',
    },

    caption: {
        color: theme.muted,
        fontSize: 12,
    },

    status: {
        fontSize: 12,
        fontWeight: '600',
    },

    empty: {
        color: theme.muted,
        padding: 24,
        textAlign: 'center',
    },
});