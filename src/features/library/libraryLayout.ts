type LayoutInput = Readonly<{
    width: number;
    columns: number;
    mode: 'shelf' | 'grid' | 'list';
    facing: 'covers' | 'spines';
    fontScale?: number;
}>;

/** Ajusta la densidad al espacio medido sin reducir los objetivos táctiles. */
export function calculateLibraryLayout({
    width,
    columns,
    mode,
    facing,
    fontScale = 1,
}: LayoutInput) {
    const safeWidth = Number.isFinite(width) ? Math.max(0, width) : 0;
    const requested = Number.isFinite(columns) ? Math.min(6, Math.max(2, Math.round(columns))) : 3;
    const scale = Number.isFinite(fontScale) ? Math.min(1.6, Math.max(1, fontScale)) : 1;
    const spines = mode === 'shelf' && facing === 'spines';
    const gap = spines ? 6 : 12;
    const sidePadding = mode === 'shelf' ? 20 : 0;
    const available = Math.max(0, safeWidth - sidePadding * 2);
    // La cuadrícula necesita además el espacio ocupado por su marco.
    const minimum = spines ? 48 : 68 * scale + (mode === 'grid' ? 16 : 0);
    const maxColumns =
        mode === 'list' ? 1 : Math.max(1, Math.min(6, Math.floor((available + gap) / (minimum + gap))));
    const effectiveColumns = mode === 'list' ? 1 : Math.min(requested, maxColumns);
    const slotWidth = Math.max(0, (available - gap * (effectiveColumns - 1)) / effectiveColumns);

    return {
        columns: effectiveColumns,
        maxColumns,
        // Dos cantos no se convierten en cajas gigantes en una pantalla ancha.
        itemWidth: spines ? Math.min(58, slotWidth) : slotWidth,
        gap,
        sidePadding,
        spineHeight: Math.min(224, Math.max(176, slotWidth * 3.5)),
    };
}
