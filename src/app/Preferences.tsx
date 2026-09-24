import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    type PropsWithChildren,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { theme } from '@/theme/theme';

export type ViewMode = 'shelf' | 'grid' | 'list';

export interface Preferences {
    view: ViewMode;
    accent: keyof typeof theme.accents;
    finish: keyof typeof theme.finishes;
    neon: boolean;
}

const defaults: Preferences = {
    view: 'shelf',
    accent: 'red',
    finish: 'obsidian',
    neon: true,
};

const storageKey = 'game-library:appearance:v1';

interface PreferencesValue {
    preferences: Preferences;
    update: (patch: Partial<Preferences>) => void;
    ready: boolean;
    storageError: string | null;
}

const Context = createContext<PreferencesValue | null>(null);

/** Valida los datos guardados antes de introducirlos en React. */
function readPreferences(raw: string | null): Preferences {
    const value: unknown = raw ? JSON.parse(raw) : null;

    if (!value || typeof value !== 'object') {
        return defaults;
    }

    const data = value as Record<string, unknown>;

    return {
        view:
            data.view === 'grid' || data.view === 'list'
                ? data.view
                : 'shelf',

        accent:
            data.accent === 'ice' || data.accent === 'gold'
                ? data.accent
                : 'red',

        finish:
            data.finish === 'graphite' || data.finish === 'steel'
                ? data.finish
                : 'obsidian',

        neon: typeof data.neon === 'boolean' ? data.neon : true,
    };
}

/** Restaura la apariencia y guarda los cambios del usuario en orden. */
export function PreferencesProvider({
    children,
}: PropsWithChildren) {
    const [preferences, setPreferences] = useState(defaults);
    const [ready, setReady] = useState(false);
    const [storageError, setStorageError] = useState<string | null>(
        null,
    );
    const [revision, setRevision] = useState(0);

    // La cadena de promesas evita que una escritura antigua termine
    // después de otra nueva y restaure accidentalmente valores anteriores.
    const writes = useRef(Promise.resolve());

    useEffect(() => {
        let active = true;

        /** Recupera las preferencias una vez durante el arranque. */
        async function restore() {
            try {
                const saved = readPreferences(
                    await AsyncStorage.getItem(storageKey),
                );

                if (active) setPreferences(saved);
            } catch {
                if (active) {
                    setStorageError(
                        'No se pudieron recuperar las preferencias.',
                    );
                }
            } finally {
                if (active) setReady(true);
            }
        }

        void restore();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        // No guardamos los valores iniciales antes de terminar la lectura.
        // Tampoco sobrescribimos datos solo por un fallo al recuperarlos.
        if (!ready || revision === 0) return;

        const serialized = JSON.stringify(preferences);

        writes.current = writes.current.then(async () => {
            try {
                await AsyncStorage.setItem(storageKey, serialized);
                setStorageError(null);
            } catch {
                setStorageError(
                    'El cambio funciona, pero no se pudo guardar en el dispositivo.',
                );
            }
        });
    }, [preferences, ready, revision]);

    /** Cambia algunas preferencias conservando las demás. */
    function update(patch: Partial<Preferences>) {
        if (!ready) return;

        setPreferences(current => ({
            ...current,
            ...patch,
        }));

        setRevision(current => current + 1);
    }

    return (
        <Context.Provider
            value={{ preferences, update, ready, storageError }}
        >
            {children}
        </Context.Provider>
    );
}

/** Obtiene las preferencias y resuelve el color de acento actual. */
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