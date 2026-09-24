import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    frame: {
        width: '100%',
        aspectRatio: 2 / 3,
        backgroundColor: theme.elevated,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        padding: 8,
    },

    image: {
        ...StyleSheet.absoluteFill,
    },

    fallback: {
        color: theme.text,
        textAlign: 'center',
        fontSize: 12,
    },
});