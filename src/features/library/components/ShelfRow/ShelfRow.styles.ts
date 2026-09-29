import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    niche: {
        overflow: 'hidden',
    },

    ceilingShadow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 30,
    },

    lighting: {
        position: 'absolute',
        top: 0,
        left: 10,
        right: 10,
        height: 80,
    },

    seam: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#FFFFFF06',
    },

    books: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 2,
    },

    leftRail: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 9,
    },

    rightRail: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 9,
    },

    top: {
        height: 4,
    },

    front: {
        height: 22,
        paddingTop: 3,
    },

    led: {
        height: 1,
        marginHorizontal: 12,
    },
});