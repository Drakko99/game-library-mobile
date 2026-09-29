export interface LibraryDisplayItem {
    id: string;
    title: string;
    platform: string;
    coverUrl: string;
    /** Imagen opcional del lomo de esta edición; si falta, se genera uno. */
    spineUrl?: string;
    accent: string;
    status: 'Pendiente' | 'Jugando' | 'Completado';
}
