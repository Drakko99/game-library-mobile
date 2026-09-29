import {
    createContext,
    useContext,
    type PropsWithChildren,
} from 'react';

import { useStoredState } from '@/hooks/useStoredState';
import { theme } from '@/theme/theme';

export type ViewMode = 'shelf' | 'grid' | 'list';

export interface Preferences {
    view: ViewMode;
    finish: keyof typeof theme.finishes;
    shelves: boolean;
    light: 'off' | 'warm' | 'accent';
    accent: keyof typeof theme.accents;
    neon: boolean;
    glass: boolean;
}

const defaults: Preferences = {
    view: 'shelf',
    finish: 'obsidian',
    shelves: true,
    light: 'accent',
    accent: 'red',
    neon: true,
    glass: true,
};

/** Conserva las preferencias antiguas y valida los campos añadidos. */
function decode(raw: string | null): Preferences {
    const value: unknown = raw ? JSON.parse(raw) : null;

    if (!value || typeof value !== 'object') return defaults;

    const data = value as Record<string, unknown>;

    return {
        view:
            data.view === 'grid' || data.view === 'list'
                ? data.view
                : 'shelf',

        finish:
            data.finish === 'steel' || data.finish === 'graphite'
                ? data.finish
                : 'obsidian',

        shelves:
            typeof data.shelves === 'boolean'
                ? data.shelves
                : true,

        light:
            data.light === 'off' || data.light === 'warm'
                ? data.light
                : 'accent',

        accent:
            data.accent === 'ice' || data.accent === 'gold'
                ? data.accent
                : 'red',

        neon: typeof data.neon === 'boolean' ? data.neon : true,
        glass: typeof data.glass === 'boolean' ? data.glass : true,
    };
}

interface Value {
    preferences: Preferences;
    update: (patch: Partial<Preferences>) => void;
    ready: boolean;
    storageError: string | null;
}

const Context = createContext<Value | null>(null);

/** Comparte la apariencia; mantiene la clave anterior para no perder elecciones. */
export function PreferencesProvider({
    children,
}: PropsWithChildren) {
    const state = useStoredState(
        'game-library:appearance:v1',
        defaults,
        decode,
    );

    return (
        <Context.Provider
            value={{
                preferences: state.value,
                update: state.update,
                ready: state.ready,
                storageError: state.error,
            }}
        >
            {children}
        </Context.Provider>
    );
}

/** Resuelve el acento global elegido por el usuario. */
export function usePreferences() {
    const value = useContext(Context);

    if (!value) {
        throw new Error('Falta PreferencesProvider.');
    }

    return {
        ...value,
        accent: theme.accents[value.preferences.accent],
    };
}