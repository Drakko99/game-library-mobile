import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { TabScreenProps } from '@/app/navigation/navigation.types';
import { useDockMetrics } from '@/app/navigation/useDockMetrics';
import { usePreferences } from '@/app/Preferences';
import { TabCanvas } from '@/components/TabCanvas/TabCanvas';
import { Action } from '@/components/Action/Action';
import { alpha } from '@/theme/theme';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { libraryDemoItems } from '../../data/library.demo';
import { orderGames } from '../../libraryOrder';
import { LibraryCollection } from '../../components/LibraryCollection/LibraryCollection';
import { createStyles } from './LibraryScreen.styles';

const filters = ['Todos', 'Jugando', 'Pendiente', 'Completado'] as const;

/** Ordena primero y filtra después, conservando la posición elegida para cada juego. */
export function LibraryScreen({ navigation }: Readonly<TabScreenProps<'Library'>>) {
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<(typeof filters)[number]>('Todos');
    const { accent, colors, preferences } = usePreferences();
    const styles = useThemedStyles(createStyles);
    const { bottomSpace } = useDockMetrics();
    const games = orderGames(libraryDemoItems, preferences.order).filter(
        (game) =>
            game.title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()) &&
            (filter === 'Todos' || game.status === filter),
    );

    return (
        <TabCanvas tab="Library">
            <View style={styles.content}>
                <Text style={[styles.brand, { color: accent }]}>GAME LIBARY</Text>
                <View>
                    <Text style={styles.title}>Biblioteca</Text>
                    <Text style={styles.caption}>
                        {libraryDemoItems.length} juegos · Colección de muestra
                    </Text>
                </View>
                <View style={styles.toolbar}>
                    <View style={styles.flex}>
                        <Action
                            label="Diseño"
                            icon="options-outline"
                            onPress={() => navigation.navigate('LibrarySettings')}
                        />
                    </View>
                    <View style={styles.flex}>
                        <Action
                            label="Ordenar"
                            icon="swap-vertical-outline"
                            onPress={() => navigation.navigate('LibraryOrder')}
                        />
                    </View>
                </View>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    accessibilityLabel="Buscar en la biblioteca"
                    placeholder="Buscar un juego"
                    placeholderTextColor={colors.muted}
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
                        {filters.map((label) => (
                            <Pressable
                                key={label}
                                onPress={() => setFilter(label)}
                                accessibilityRole="button"
                                accessibilityState={{ selected: filter === label }}
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
                                        { color: filter === label ? colors.text : colors.muted },
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
                    onOpen={(id) => navigation.navigate('Game', { id })}
                />
            </View>
        </TabCanvas>
    );
}