import type { LibraryDisplayItem } from './types';

/** Conserva el orden guardado y añade al final los juegos recién incorporados. */
export function orderGames(
    games: readonly LibraryDisplayItem[],
    ids: readonly string[],
): LibraryDisplayItem[] {
    const byId = new Map(games.map((game) => [game.id, game]));
    const result: LibraryDisplayItem[] = [];
    for (const id of ids) {
        const game = byId.get(id);
        if (game) {
            result.push(game);
            byId.delete(id);
        }
    }
    return [...result, ...byId.values()];
}

/** Mueve un juego antes de otro, sin duplicarlo ni modificar el array original. */
export function moveBefore(ids: readonly string[], source: string, target: string): string[] {
    if (source === target || !ids.includes(source) || !ids.includes(target)) return [...ids];
    const next = ids.filter((id) => id !== source);
    next.splice(next.indexOf(target), 0, source);
    return next;
}