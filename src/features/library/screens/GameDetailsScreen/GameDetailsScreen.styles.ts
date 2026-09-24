import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.background,
    },

    fill: {
        ...StyleSheet.absoluteFill,
    },

    backdrop: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 440,
    },

    content: {
        paddingHorizontal: 24,
        gap: 24,
        flexGrow: 1,
    },

    backButton: {
        alignSelf: 'flex-start',
    },

    poster: {
        width: 180,
        alignSelf: 'center',
        borderRadius: 8,
        marginTop: 12,
    },

    title: {
        color: theme.text,
        fontSize: 34,
        fontWeight: '800',
        textAlign: 'center',
    },

    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },

    chip: {
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    panel: {
        backgroundColor: theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 20,
        padding: 20,
        gap: 16,
    },

    panelTitle: {
        color: theme.text,
        fontSize: 20,
        fontWeight: '700',
    },

    text: {
        color: theme.text,
        fontSize: 16,
    },

    note: {
        color: theme.muted,
        fontSize: 14,
        lineHeight: 22,
    },
});