import { useEffect, useState } from 'react';

import {
    getDiscovery,
    type DiscoveryKind,
    type DiscoveryResponse,
} from './discovery.api';

/** Cancela consultas anteriores y distingue carga, error y catálogo vacío. */
export function useDiscovery(kind: DiscoveryKind) {
    const [data, setData] =
        useState<DiscoveryResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [revision, setRevision] = useState(0);

    useEffect(() => {
        let active = true;

        const controller = new AbortController();
        const timeout = setTimeout(
            () => controller.abort(),
            15000,
        );

        setLoading(true);
        setData(null);
        setError(null);

        /** Solicita datos y descarta resultados de una pestaña ya abandonada. */
        async function load() {
            try {
                const response = await getDiscovery(
                    kind,
                    controller.signal,
                );

                if (active) setData(response);
            } catch (cause) {
                if (active) {
                    setError(
                        controller.signal.aborted
                            ? 'La consulta tardó demasiado. Inténtalo de nuevo.'
                            : cause instanceof Error
                                ? cause.message
                                : 'No se pudo cargar el catálogo.',
                    );
                }
            } finally {
                clearTimeout(timeout);
                if (active) setLoading(false);
            }
        }

        void load();

        return () => {
            active = false;
            clearTimeout(timeout);
            controller.abort();
        };
    }, [kind, revision]);

    /** Repite únicamente la categoría visible. */
    function retry() {
        setRevision(value => value + 1);
    }

    return { data, loading, error, retry };
}