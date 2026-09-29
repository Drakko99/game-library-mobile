import { useState } from 'react';
import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

import type { TabScreenProps } from '@/app/navigation/navigation.types';
import { useDockMetrics } from '@/app/navigation/useDockMetrics';
import { usePreferences } from '@/app/Preferences';
import { TabCanvas } from '@/components/TabCanvas/TabCanvas';
import { Action } from '@/components/Action/Action';
import { theme, alpha } from '@/theme/theme';

import { libraryDemoItems } from '../../data/library.demo';
import { LibraryCollection } from '../../components/LibraryCollection/LibraryCollection';
import { styles } from './LibraryScreen.styles';

const filters = [
    'Todos',
    'Jugando',
    'Pendiente',
    'Completado',
] as const;

/** Busca y filtra la colección manteniendo una sola lista vertical. */
export function LibraryScreen({
    navigation,
}: TabScreenProps<'Library'>) {
    const [query, setQuery] = useState('');
    const [filter, setFilter] =
        useState<(typeof filters)[number]>('Todos');

    const { accent } = usePreferences();
    const { bottomSpace } = useDockMetrics();

    const games = libraryDemoItems.filter(
        game =>
            game.title
                .toLocaleLowerCase()
                .includes(query.trim().toLocaleLowerCase()) &&
            (filter === 'Todos' || game.status === filter),
    );

    return (
        <TabCanvas tab="Library">
            <View style={styles.content}>
                <Text style={[styles.brand, { color: accent }]}>
                    GAME LIBARY
                </Text>

                <View style={styles.heading}>
                    <View style={styles.flex}>
                        <Text style={styles.title}>Biblioteca</Text>
                        <Text style={styles.caption}>
                            {libraryDemoItems.length} juegos · Colección
                            de muestra
                        </Text>
                    </View>
                </View>

                <Action
                    label="Diseño de la biblioteca"
                    icon="options-outline"
                    onPress={() =>
                        navigation.navigate('LibrarySettings')
                    }
                />

                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    accessibilityLabel="Buscar en la biblioteca"
                    placeholder="Buscar un juego"
                    placeholderTextColor={theme.muted}
                    selectionColor={accent}
                    autoCorrect={false}
                    style={styles.search}
                />

                <View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filters}
                    >
                        {filters.map(label => (
                            <Pressable
                                key={label}
                                onPress={() => setFilter(label)}
                                accessibilityRole="button"
                                accessibilityState={{
                                    selected: filter === label,
                                }}
                                style={[
                                    styles.chip,
                                    filter === label && {
                                        backgroundColor: alpha(accent, 0.15),
                                        borderColor: accent,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        {
                                            color:
                                                filter === label
                                                    ? accent
                                                    : theme.muted,
                                        },
                                    ]}
                                >
                                    {filter === label ? '• ' : ''}
                                    {label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                <LibraryCollection
                    games={games}
                    bottomSpace={bottomSpace}
                    onOpen={id =>
                        navigation.navigate('Game', { id })
                    }
                />
            </View>
        </TabCanvas>
    );
}