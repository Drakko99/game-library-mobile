import { StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

export const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.surface,
    },

    content: {
        padding: 20,
        gap: 12,
    },

    heading: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },

    title: {
        color: theme.text,
        fontSize: 26,
        fontWeight: '800',
    },

    subtitle: {
        color: theme.muted,
        fontSize: 13,
    },

    sectionTitle: {
        color: theme.text,
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
    },

    options: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },

    choice: {
        flexGrow: 1,
        flexBasis: 95,
        borderWidth: 1,
        borderRadius: 18,
        padding: 12,
        gap: 12,
    },

    choiceLabel: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: '600',
    },

    preview: {
        height: 66,
        padding: 6,
        backgroundColor: theme.background,
        borderRadius: 8,
        gap: 5,
    },

    previewRow: {
        flex: 1,
        flexDirection: 'row',
        gap: 4,
    },

    previewShelf: {
        borderBottomWidth: 3,
        borderBottomColor: '#888888',
        paddingBottom: 2,
    },

    miniCover: {
        width: '26%',
        height: '100%',
        borderRadius: 2,
    },

    miniText: {
        flex: 1,
        height: 4,
        alignSelf: 'center',
        backgroundColor: theme.muted,
    },

    swatch: {
        height: 46,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFFFFF22',
    },

    toggle: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },

    toggleLabel: {
        flex: 1,
        color: theme.text,
        fontSize: 16,
    },

    error: {
        color: '#FF9D9D',
        fontSize: 13,
    },
});