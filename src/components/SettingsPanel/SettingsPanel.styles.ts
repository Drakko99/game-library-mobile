import { StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    content: {
        padding: 20,
        gap: 24,
    },

    title: {
        color: theme.text,
        fontSize: 28,
        fontWeight: '800',
    },

    heading: {
        color: theme.text,
        fontSize: 18,
        fontWeight: '700',
    },

    section: { gap: 12 },

    choices: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    choice: {
        flexGrow: 1,
        flexBasis: 92,
        minHeight: 90,
        padding: 12,
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 20,
    },

    swatch: {
        width: 38,
        height: 18,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#FFFFFF30',
    },

    label: {
        color: theme.text,
        fontSize: 14,
        fontWeight: '600',
    },

    note: {
        color: theme.muted,
        fontSize: 14,
        lineHeight: 22,
    },

    toggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        minHeight: 52,
    },

    flex: { flex: 1 },
});