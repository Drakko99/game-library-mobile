import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background,
    },

    brand: {
        color: theme.accents.red,
        fontSize: 26,
        fontWeight: '800',
    },
});