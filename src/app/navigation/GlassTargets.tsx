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

/** Asigna un fondo independiente a cada pestaña. */
export function GlassTargetsProvider({
    children,
}: PropsWithChildren) {
    const Library = useRef<View | null>(null);
    const Explore = useRef<View | null>(null);
    const Profile = useRef<View | null>(null);
    const AppSettings = useRef<View | null>(null);

    return (
        <Context.Provider
            value={{ Library, Explore, Profile, AppSettings }}
        >
            {children}
        </Context.Provider>
    );
}

/** Obtiene las referencias que necesita el desenfoque de Android. */
export function useGlassTargets() {
    const value = useContext(Context);

    if (!value) {
        throw new Error('Falta GlassTargetsProvider.');
    }

    return value;
}