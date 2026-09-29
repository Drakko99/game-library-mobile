import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Restaura un estado validado y serializa las escrituras posteriores. */
export function useStoredState<T>(key: string, initial: T, decode: (raw: string | null) => T) {
    const [value, setValue] = useState(initial);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revision, setRevision] = useState(0);
    const writes = useRef(Promise.resolve());

    useEffect(() => {
        let active = true;

        /** Lee una vez; nunca sobrescribe el almacenamiento durante el arranque. */
        async function restore() {
            try {
                const saved = decode(await AsyncStorage.getItem(key));
                if (active) setValue(saved);
            } catch {
                if (active) {
                    setError('No se pudieron recuperar los datos guardados.');
                }
            } finally {
                if (active) setReady(true);
            }
        }

        void restore();

        return () => {
            active = false;
        };
    }, [key, decode]);

    useEffect(() => {
        if (!ready || revision === 0) return;

        const snapshot = JSON.stringify(value);

        // Una escritura antigua no puede terminar después de la más reciente.
        writes.current = writes.current.then(async () => {
            try {
                await AsyncStorage.setItem(key, snapshot);
                setError(null);
            } catch {
                setError('El cambio se aplica, pero no se pudo guardar en este dispositivo.');
            }
        });
    }, [key, ready, revision, value]);

    /** Mezcla un cambio parcial con el estado más reciente. */
    function update(patch: Partial<T> | ((current: T) => Partial<T>)) {
        if (!ready) return;

        setValue((current) => ({
            ...current,
            ...(typeof patch === 'function' ? patch(current) : patch),
        }));
        setRevision((current) => current + 1);
    }

    return { value, ready, error, update };
}