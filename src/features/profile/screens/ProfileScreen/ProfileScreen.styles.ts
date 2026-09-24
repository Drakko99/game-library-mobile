import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.background,
    },

    content: {
        padding: 24,
        gap: 20,
    },

    avatar: {
        width: 88,
        height: 88,
        borderRadius: 28,
        borderWidth: 1,
        backgroundColor: theme.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        color: theme.text,
        fontSize: 34,
        fontWeight: '800',
    },

    subtitle: {
        color: theme.muted,
        fontSize: 15,
    },

    stats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    stat: {
        flexGrow: 1,
        flexBasis: 90,
        borderRadius: 18,
        padding: 16,
        backgroundColor: theme.surface,
        gap: 6,
    },

    number: {
        fontSize: 30,
        fontWeight: '800',
    },

    label: {
        color: theme.text,
        fontSize: 12,
    },

    note: {
        color: theme.muted,
        fontSize: 14,
        lineHeight: 22,
    },
});