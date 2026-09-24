export interface LibraryDisplayItem {
    id: string;
    title: string;
    platform: string;
    coverUrl: string;
    accent: string;
    status: 'Pendiente' | 'Jugando' | 'Completado';
}