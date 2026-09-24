import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { BlurTargetView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { useGlassTargets } from '@/app/navigation/GlassTargets';
import type { TabScreenProps } from '@/app/navigation/navigation.types';
import { usePreferences } from '@/app/Preferences';
import { Action } from '@/components/Action/Action';
import { theme } from '@/theme/theme';
import { libraryDemoItems } from '../../data/library.demo';
import { LibraryCollection } from '../../components/LibraryCollection/LibraryCollection';
import { styles } from './LibraryScreen.styles';

/** Muestra la colección y permite buscar, personalizar y abrir fichas. */
export function LibraryScreen({
    navigation,
}: TabScreenProps<'Library'>) {
    const [query, setQuery] = useState('');
    const { accent } = usePreferences();
    const targets = useGlassTargets();
    const insets = useSafeAreaInsets();
    const barHeight = useBottomTabBarHeight();

    const games = libraryDemoItems.filter(game =>
        game.title
            .toLocaleLowerCase()
            .includes(query.trim().toLocaleLowerCase()),
    );

    /** Abre las opciones como una hoja sobre la pantalla actual. */
    function customize() {
        navigation.navigate('Customize');
    }

    /** Pasa únicamente el identificador a la ficha del juego. */
    function openGame(id: string) {
        navigation.navigate('Game', { id });
    }

    return (
        <BlurTargetView ref={targets.Library} style={styles.root}>
            <SafeAreaView
                edges={['top', 'left', 'right']}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={[styles.brand, { color: accent }]}>
                        GAME LIBARY
                    </Text>

                    <Text style={styles.title}>Biblioteca</Text>

                    <Text style={styles.subtitle}>
                        Tu colección, a tu manera · Demostración
                    </Text>
                </View>

                <View style={styles.toolbar}>
                    <Text style={styles.counter}>{games.length} juegos</Text>

                    <Action
                        label="Personalizar"
                        icon="options-outline"
                        onPress={customize}
                    />
                </View>

                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Buscar en tu biblioteca"
                    placeholderTextColor={theme.muted}
                    style={styles.search}
                    accessibilityLabel="Buscar juegos"
                    autoCorrect={false}
                />

                <LibraryCollection
                    games={games}
                    onOpen={openGame}
                    bottomSpace={barHeight + insets.bottom + 32}
                />
            </SafeAreaView>
        </BlurTargetView>
    );
}