import type { LibraryDisplayItem } from '../types';

/** Construye la dirección pública de una carátula de muestra de Steam. */
function cover(appId: number) {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/library_600x900.jpg`;
}

// Colección ficticia.
// Los acentos están elegidos manualmente para esta demostración.
export const libraryDemoItems: LibraryDisplayItem[] = [
    {
        id: 'elden-ring',
        title: 'Elden Ring',
        platform: 'PC',
        coverUrl: cover(1245620),
        accent: '#E7C47C',
        status: 'Jugando',
    },
    {
        id: 'hollow-knight',
        title: 'Hollow Knight',
        platform: 'PC',
        coverUrl: cover(367520),
        accent: '#9ECFF1',
        status: 'Pendiente',
    },
    {
        id: 'hades',
        title: 'Hades',
        platform: 'PC',
        coverUrl: cover(1145360),
        accent: '#FF705B',
        status: 'Completado',
    },
    {
        id: 'celeste',
        title: 'Celeste',
        platform: 'PC',
        coverUrl: cover(504230),
        accent: '#C2A5FF',
        status: 'Completado',
    },
    {
        id: 'doom',
        title: 'DOOM Eternal',
        platform: 'PC',
        coverUrl: cover(782330),
        accent: '#FFAD66',
        status: 'Pendiente',
    },
    {
        id: 'nier',
        title: 'NieR: Automata',
        platform: 'PC',
        coverUrl: cover(524220),
        accent: '#D5D0BC',
        status: 'Jugando',
    },
];