import {
    createContext,
    useContext,
    type PropsWithChildren,
} from 'react';

import { useStoredState } from '@/hooks/useStoredState';

const defaults = { username: 'Jugador' };

type Profile = typeof defaults;

/** Valida exclusivamente el nombre local; aquí no se guardan credenciales. */
function decode(raw: string | null): Profile {
    const data: unknown = raw ? JSON.parse(raw) : null;

    if (
        data &&
        typeof data === 'object' &&
        'username' in data &&
        typeof data.username === 'string' &&
        data.username.trim().length >= 3 &&
        data.username.trim().length <= 30
    ) {
        return { username: data.username.trim() };
    }

    return defaults;
}

const Context = createContext<
    ReturnType<typeof useStoredState<Profile>> | null
>(null);

/** Mantiene separado el perfil local de los ajustes visuales. */
export function LocalProfileProvider({
    children,
}: PropsWithChildren) {
    const state = useStoredState(
        'game-library:local-profile:v1',
        defaults,
        decode,
    );

    return (
        <Context.Provider value={state}>
            {children}
        </Context.Provider>
    );
}

/** Recupera el perfil del prototipo, pendiente de la cuenta autenticada. */
export function useLocalProfile() {
    const value = useContext(Context);

    if (!value) {
        throw new Error('Falta LocalProfileProvider.');
    }

    return value;
}