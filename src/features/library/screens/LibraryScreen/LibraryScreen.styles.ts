import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.background,
    },

    content: {
        flex: 1,
        width: '100%',
        maxWidth: 900,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },

    header: {
        paddingTop: 18,
        paddingBottom: 18,
        gap: 8,
    },

    brand: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 3,
    },

    title: {
        color: theme.text,
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: -1,
    },

    subtitle: {
        color: theme.muted,
        fontSize: 12,
    },

    toolbar: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 14,
    },

    counter: {
        color: theme.text,
        fontSize: 15,
        fontWeight: '600',
    },

    search: {
        color: theme.text,
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 16,
        minHeight: 48,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
    },
});