import {
    createContext,
    useContext,
    useRef,
    type PropsWithChildren,
    type RefObject,
} from 'react';
import type { View } from 'react-native';

import type { TabParams } from './navigation.types';

const Context = createContext<
    Record<keyof TabParams, RefObject<View | null>> | null
>(null);

/** Conserva un fondo por pestaña para el desenfoque de Android. */
export function GlassTargetsProvider({
    children,
}: PropsWithChildren) {
    const Library = useRef<View | null>(null);
    const Profile = useRef<View | null>(null);

    return (
        <Context.Provider value={{ Library, Profile }}>
            {children}
        </Context.Provider>
    );
}

/** Recupera los fondos que hay detrás de la barra inferior. */
export function useGlassTargets() {
    const value = useContext(Context);

    if (!value) {
        throw new Error('Falta GlassTargetsProvider.');
    }

    return value;
}