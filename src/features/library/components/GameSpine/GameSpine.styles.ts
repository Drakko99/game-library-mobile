import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    frame: {
        overflow: 'hidden',
        borderRadius: 5,
        backgroundColor: '#15191F',
        borderWidth: 1,
        borderColor: '#FFFFFF38',
    },
    image: { ...StyleSheet.absoluteFill },
    platform: { height: 30, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
    platformText: { fontWeight: '800', fontSize: 10, letterSpacing: 0.3 },
    titleBox: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
    title: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, lineHeight: 20, textAlign: 'center' },
    bottom: { position: 'absolute', bottom: 7, left: 8, right: 8, height: 2, borderRadius: 1 },
    bevel: { ...StyleSheet.absoluteFill },
});
