import { StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.background,
    },

    input: {
        minHeight: 52,
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        backgroundColor: theme.surface,
        color: theme.text,
        fontSize: 16,
    },
});