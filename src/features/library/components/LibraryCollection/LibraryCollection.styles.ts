import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    container: { flex: 1 },

    section: {
        marginBottom: 22,
        overflow: 'visible',
    },

    ambient: {
        ...StyleSheet.absoluteFill,
        borderRadius: 14,
    },

    fill: {
        ...StyleSheet.absoluteFill,
    },

    row: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'stretch',
    },

    shelfRow: {
        paddingHorizontal: 12,
        paddingTop: 24,
        paddingBottom: 2,
        alignItems: 'flex-end',
    },

    cell: {
        flex: 1,
        minWidth: 0,
    },

    cover: {
        width: '100%',
    },

    gridCard: {
        padding: 8,
        borderRadius: 16,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
    },

    listCard: {
        flexDirection: 'row',
        gap: 16,
        padding: 12,
        backgroundColor: theme.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: theme.border,
    },

    listCover: {
        width: 76,
    },

    metadata: {
        flex: 1,
        padding: 6,
        gap: 6,
        justifyContent: 'center',
    },

    title: {
        color: theme.text,
        fontSize: 16,
        fontWeight: '700',
    },

    platform: {
        color: theme.muted,
        fontSize: 12,
    },

    status: {
        fontSize: 12,
        fontWeight: '600',
    },

    open: {
        color: theme.muted,
        fontSize: 12,
        marginTop: 8,
    },

    beam: {
        height: 22,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },

    led: {
        height: 2,
        zIndex: 1,
    },

    empty: {
        color: theme.muted,
        textAlign: 'center',
        padding: 24,
    },
});