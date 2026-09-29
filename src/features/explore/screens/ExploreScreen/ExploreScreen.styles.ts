import { StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    content: {
        padding: 20,
        gap: 16,
    },

    header: {
        gap: 16,
        marginBottom: 12,
    },

    title: {
        color: theme.text,
        fontSize: 32,
        fontWeight: '800',
    },

    note: {
        color: theme.muted,
        fontSize: 13,
        lineHeight: 20,
    },

    tabs: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    tab: {
        flexGrow: 1,
        minHeight: 48,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
    },

    tabLabel: {
        color: theme.text,
        fontSize: 13,
        fontWeight: '600',
    },

    card: {
        flexDirection: 'row',
        gap: 14,
        padding: 12,
        backgroundColor: theme.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.border,
    },

    poster: {
        width: 82,
        height: 123,
        backgroundColor: theme.elevated,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },

    placeholder: {
        color: theme.muted,
        fontSize: 11,
    },

    fill: {
        ...StyleSheet.absoluteFill,
    },

    info: {
        flex: 1,
        gap: 8,
    },

    name: {
        color: theme.text,
        fontSize: 17,
        fontWeight: '700',
    },
});