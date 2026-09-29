import { Platform } from 'react-native';

export type DiscoveryKind =
    | 'trending'
    | 'recent'
    | 'upcoming';

export interface DiscoveryGame {
    id: number;
    name: string;
    coverUrl: string | null;
    platforms: string[];
    releaseYear: number | null;
    url: string | null;
}

export interface DiscoveryResponse {
    source: 'IGDB';
    updatedAt: string;
    results: DiscoveryGame[];
}

// Esta URL es pública. Las claves de IGDB permanecen exclusivamente en NestJS.
const apiUrl = (
    process.env.EXPO_PUBLIC_API_URL ??
    (Platform.OS === 'android'
        ? 'http://10.0.2.2:3000'
        : 'http://localhost:3000')
).replace(/\/$/, '');

/** Valida la respuesta antes de permitir que una pantalla la utilice. */
export async function getDiscovery(
    kind: DiscoveryKind,
    signal: AbortSignal,
): Promise<DiscoveryResponse> {
    const response = await fetch(
        `${apiUrl}/games/discover?section=${kind}`,
        { signal },
    );

    if (!response.ok) {
        throw new Error(
            'No se pudo obtener el catálogo. Comprueba que la API esté arrancada y actualizada.',
        );
    }

    const data =
        (await response.json()) as DiscoveryResponse;

    if (
        !data ||
        data.source !== 'IGDB' ||
        typeof data.updatedAt !== 'string' ||
        !Array.isArray(data.results) ||
        data.results.some(
            game =>
                !game ||
                !Number.isSafeInteger(game.id) ||
                typeof game.name !== 'string' ||
                (game.coverUrl !== null &&
                    typeof game.coverUrl !== 'string') ||
                !Array.isArray(game.platforms) ||
                game.platforms.some(
                    platform => typeof platform !== 'string',
                ) ||
                (game.releaseYear !== null &&
                    !Number.isInteger(game.releaseYear)) ||
                (game.url !== null &&
                    typeof game.url !== 'string'),
        )
    ) {
        throw new Error(
            'La API devolvió un catálogo con formato inesperado.',
        );
    }

    return data;
}