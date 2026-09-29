import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useStoredState } from '@/hooks/useStoredState';
import { createPalette, presets } from '@/theme/appPalette';
import { defaults, decodePreferences, type Preferences } from './preferences.model';
export type { Preferences, ViewMode } from './preferences.model';

interface Value {
    preferences: Preferences;
    update: (patch: Partial<Preferences> | ((current: Preferences) => Partial<Preferences>)) => void;
    ready: boolean;
    storageError: string | null;
}
const Context = createContext<Value | null>(null);

/** Comparte la apariencia conservando la clave de almacenamiento anterior. */
export function PreferencesProvider({ children }: Readonly<PropsWithChildren>) {
    const state = useStoredState('game-library:appearance:v1', defaults, decodePreferences);
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

/** Resuelve el tema activo; cambiar un preset no destruye el tema personal. */
export function usePreferences() {
    const value = useContext(Context);
    if (!value) throw new Error('Falta PreferencesProvider.');
    const { themeId, customBackground, customAccent } = value.preferences;
    const palette = useMemo(() => {
        const selected =
            themeId === 'custom'
                ? { background: customBackground, accent: customAccent }
                : presets[themeId];
        return createPalette(selected.background, selected.accent);
    }, [themeId, customBackground, customAccent]);
    return { ...value, ...palette };
}
