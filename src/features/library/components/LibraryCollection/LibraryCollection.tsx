import { useState } from 'react';
import {
    FlatList,
    Pressable,
    Text,
    View,
    useWindowDimensions,
    type LayoutChangeEvent,
    type ListRenderItemInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { usePreferences } from '@/app/Preferences';
import { theme, alpha } from '@/theme/theme';
import type { LibraryDisplayItem } from '../../types';
import { GameCover } from '../GameCover/GameCover';
import { styles } from './LibraryCollection.styles';

interface Props {
    games: LibraryDisplayItem[];
    bottomSpace: number;
    onOpen: (id: string) => void;
}

/** Distribuye los juegos en filas sin modificar la colección original. */
function groupRows(
    games: LibraryDisplayItem[],
    columns: number,
) {
    const rows: LibraryDisplayItem[][] = [];

    for (let i = 0; i < games.length; i += columns) {
        rows.push(games.slice(i, i + columns));
    }

    return rows;
}

/** Ofrece tres composiciones diferentes sobre los mismos datos. */
export function LibraryCollection({
    games,
    bottomSpace,
    onOpen,
}: Props) {
    const { preferences, accent } = usePreferences();
    const { fontScale } = useWindowDimensions();
    const [width, setWidth] = useState(0);

    const mode = preferences.view;
    const minimum = (mode === 'shelf' ? 90 : 150) * fontScale;

    const columns =
        mode === 'list'
            ? 1
            : Math.max(
                1,
                Math.min(
                    5,
                    Math.floor((width - 12) / (minimum + 12)),
                ),
            );

    const rows = groupRows(games, columns);

    /** Recoge el ancho real, también cuando cambia la ventana. */
    function handleLayout(event: LayoutChangeEvent) {
        setWidth(event.nativeEvent.layout.width);
    }

    /** Construye una fila con el diseño elegido. */
    function renderRow({
        item: row,
    }: ListRenderItemInfo<LibraryDisplayItem[]>) {
        const shelf = mode === 'shelf';

        return (
            <View
                style={[
                    styles.section,
                    shelf && {
                        backgroundColor: theme.finishes[preferences.finish],
                        borderRadius: 14,
                    },
                ]}
            >
                {shelf && preferences.neon && (
                    <LinearGradient
                        colors={[alpha(accent, 0.16), alpha(accent, 0)]}
                        style={styles.ambient}
                        pointerEvents="none"
                    />
                )}

                <View style={[styles.row, shelf && styles.shelfRow]}>
                    {row.map(game => (
                        <Pressable
                            key={game.id}
                            onPress={() => onOpen(game.id)}
                            accessibilityRole="button"
                            accessibilityLabel={`Abrir ${game.title}. ${game.status}.`}
                            style={[
                                styles.cell,
                                mode === 'grid' && styles.gridCard,
                                mode === 'list' && styles.listCard,
                            ]}
                        >
                            <View
                                style={
                                    mode === 'list' ? styles.listCover : styles.cover
                                }
                            >
                                <GameCover game={game} />
                            </View>

                            {mode !== 'shelf' && (
                                <View style={styles.metadata}>
                                    <Text style={styles.title} numberOfLines={2}>
                                        {game.title}
                                    </Text>

                                    <Text style={styles.platform}>
                                        {game.platform}
                                    </Text>

                                    <Text style={[styles.status, { color: accent }]}>
                                        {game.status}
                                    </Text>

                                    {mode === 'list' && (
                                        <Text style={styles.open}>Ver ficha →</Text>
                                    )}
                                </View>
                            )}
                        </Pressable>
                    ))}

                    {/* Conserva el ancho de las portadas en filas incompletas. */}
                    {Array.from(
                        { length: columns - row.length },
                        (_, i) => (
                            <View key={`space-${i}`} style={styles.cell} />
                        ),
                    )}
                </View>

                {shelf && (
                    <View
                        style={[
                            styles.beam,
                            {
                                backgroundColor:
                                    theme.finishes[preferences.finish],
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.led,
                                {
                                    backgroundColor: preferences.neon
                                        ? accent
                                        : theme.border,

                                    boxShadow: preferences.neon
                                        ? `0 0 12px ${alpha(accent, 0.65)}`
                                        : 'none',
                                },
                            ]}
                        />

                        <LinearGradient
                            colors={['#FFFFFF18', '#000000BB']}
                            style={styles.fill}
                        />
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container} onLayout={handleLayout}>
            {width > 0 && (
                <FlatList
                    data={rows}
                    renderItem={renderRow}
                    keyExtractor={row => row[0].id}
                    contentContainerStyle={{
                        paddingTop: 20,
                        paddingBottom: bottomSpace,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    ListEmptyComponent={
                        <Text style={styles.empty}>
                            No hay juegos que coincidan.
                        </Text>
                    }
                />
            )}
        </View>
    );
}