import { Platform } from 'react-native';

export type DiscoveryKind = 'trending' | 'recent' | 'upcoming';
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

// URL pública: las credenciales de IGDB se mantienen exclusivamente en NestJS.
const apiUrl = (
    process.env.EXPO_PUBLIC_API_URL?.trim() ||
    (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000')
).replace(/\/+$/, '');

/** Comprueba cada registro recibido antes de permitir que la pantalla lo utilice. */
function isGame(value: unknown): value is DiscoveryGame {
    if (!value || typeof value !== 'object') return false;
    const game = value as Record<string, unknown>;
    return (
        Number.isSafeInteger(game.id) &&
        Number(game.id) > 0 &&
        typeof game.name === 'string' &&
        (game.coverUrl === null || typeof game.coverUrl === 'string') &&
        Array.isArray(game.platforms) &&
        game.platforms.every((platform) => typeof platform === 'string') &&
        (game.releaseYear === null || Number.isInteger(game.releaseYear)) &&
        (game.url === null || typeof game.url === 'string')
    );
}

/** Distingue fallos de conexión, errores HTTP y respuestas con formato incorrecto. */
export async function getDiscovery(
    kind: DiscoveryKind,
    signal: AbortSignal,
): Promise<DiscoveryResponse> {
    let response: Response;
    try {
        response = await fetch(apiUrl + '/games/discover?section=' + kind, { signal });
    } catch (cause) {
        if (signal.aborted) throw cause;
        throw new Error(
            'No se pudo conectar con el servidor. Comprueba que la API esté en marcha y vuelve a intentarlo.',
        );
    }
    if (!response.ok) {
        throw new Error(
            response.status === 404
                ? 'El servidor todavía no dispone de la ruta de Explorar.'
                : 'El servidor no pudo obtener el catálogo. Inténtalo de nuevo en unos instantes.',
        );
    }
    let data: unknown;
    try {
        data = await response.json();
    } catch {
        throw new Error('El servidor devolvió una respuesta que no se puede leer.');
    }
    if (!data || typeof data !== 'object') throw new Error('Formato de catálogo inesperado.');
    const result = data as Record<string, unknown>;
    if (
        result.source !== 'IGDB' ||
        typeof result.updatedAt !== 'string' ||
        !Number.isFinite(Date.parse(result.updatedAt)) ||
        !Array.isArray(result.results) ||
        !result.results.every(isGame)
    ) {
        throw new Error('Formato de catálogo inesperado.');
    }
    return result as unknown as DiscoveryResponse;
}
