import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    content: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 18,
        backgroundColor: theme.surface,
    },

    label: {
        color: theme.text,
        fontSize: 14,
        fontWeight: '600',
    },
});