import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    host: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
    shadow: { borderRadius: 32, boxShadow: '0 8px 24px #00000050' },
    clip: { flex: 1, borderRadius: 32, overflow: 'hidden' },
    fill: { ...StyleSheet.absoluteFill },
    rim: { ...StyleSheet.absoluteFill, borderRadius: 32, borderWidth: 1 },
    selection: {
        position: 'absolute',
        top: 6,
        bottom: 6,
        left: 6,
        borderRadius: 25,
        borderWidth: 1,
    },
    items: { flex: 1, flexDirection: 'row', padding: 6 },
    item: { flex: 1, minHeight: 48 },
    itemContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
    label: { fontSize: 10 },
});