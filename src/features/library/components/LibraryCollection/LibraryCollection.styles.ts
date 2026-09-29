import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1 },
    row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
    cell: { minWidth: 0, flexShrink: 0 },
    shelfCell: { alignItems: 'center', justifyContent: 'flex-end' },
    case: { borderRadius: 8, boxShadow: '2px 3px 5px #00000055', transformOrigin: 'center bottom' },
    caseEdge: {
        position: 'absolute',
        top: 3,
        bottom: 3,
        left: 0,
        width: 3,
        borderRadius: 2,
        backgroundColor: '#FFFFFF30',
    },
    grid: { padding: 8, borderRadius: 16, borderWidth: 1 },
    list: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 18, borderWidth: 1 },
    listCover: { width: 68, flexShrink: 0 },
    metadata: { minWidth: 0, paddingTop: 8, gap: 5, justifyContent: 'center' },
    listMetadata: { flex: 1, paddingTop: 0 },
    title: { fontSize: 14, fontWeight: '700' },
    caption: { fontSize: 12 },
    status: { fontSize: 12, fontWeight: '600' },
    empty: { padding: 24, textAlign: 'center' },
});
