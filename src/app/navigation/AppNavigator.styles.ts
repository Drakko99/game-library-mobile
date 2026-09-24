import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    scene: {
        backgroundColor: theme.background,
    },

    sheet: {
        backgroundColor: theme.surface,
    },

    tabItem: {
        paddingVertical: 6,
    },

    tabBar: {
        position: 'absolute',
        left: 20,
        right: 20,
        borderWidth: 1,
        borderTopWidth: 1,
        borderRadius: 24,
        backgroundColor: 'transparent',
        overflow: 'hidden',
        elevation: 0,
    },

    glass: {
        ...StyleSheet.absoluteFill,
        backgroundColor: theme.glass,
    },
});