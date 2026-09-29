import { useState } from 'react';
import {
    FlatList,
    Pressable,
    Text,
    View,
    useWindowDimensions,
    type ListRenderItemInfo,
} from 'react-native';

import { usePreferences } from '@/app/Preferences';
import type { LibraryDisplayItem } from '../../types';
import { GameCover } from '../GameCover/GameCover';
import { ShelfRow } from '../ShelfRow/ShelfRow';
import { styles } from './LibraryCollection.styles';

interface Props {
    games: LibraryDisplayItem[];
    bottomSpace: number;
    onOpen: (id: string) => void;
}

/** Agrupa sin mutar los datos, conservando huecos al final de la última fila. */
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

/** Virtualiza filas y cambia la composición según el modo elegido. */
export function LibraryCollection({
    games,
    bottomSpace,
    onOpen,
}: Props) {
    const { preferences, accent } = usePreferences();
    const { fontScale } = useWindowDimensions();
    const [width, setWidth] = useState(0);

    const mode = preferences.view;

    const columns =
        mode === 'list'
            ? 1
            : Math.max(
                1,
                Math.min(
                    5,
                    Math.floor(
                        (width - 28) /
                        ((mode === 'shelf' ? 88 : 145) *
                            fontScale +
                            12),
                    ),
                ),
            );

    /** Comparte las portadas; solo la estantería añade estructura física. */
    function renderRow({
        item: row,
    }: ListRenderItemInfo<LibraryDisplayItem[]>) {
        const covers = (
            <>
                {row.map(game => (
                    <Pressable
                        key={game.id}
                        onPress={() => onOpen(game.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`${game.title}. ${game.status}. Abrir ficha.`}
                        style={({ pressed }) => [
                            styles.cell,
                            mode === 'grid' && styles.grid,
                            mode === 'list' && styles.list,
                            { opacity: pressed ? 0.72 : 1 },
                        ]}
                    >
                        <View
                            style={
                                mode === 'list'
                                    ? styles.listCover
                                    : styles.cover
                            }
                        >
                            <GameCover game={game} />
                        </View>

                        {mode !== 'shelf' && (
                            <View style={styles.metadata}>
                                <Text
                                    style={styles.title}
                                    numberOfLines={2}
                                >
                                    {game.title}
                                </Text>

                                <Text style={styles.caption}>
                                    {game.platform}
                                </Text>

                                <Text
                                    style={[
                                        styles.status,
                                        { color: accent },
                                    ]}
                                >
                                    {game.status}
                                </Text>
                            </View>
                        )}
                    </Pressable>
                ))}

                {Array.from(
                    { length: columns - row.length },
                    (_, i) => (
                        <View
                            key={`gap-${i}`}
                            style={styles.cell}
                        />
                    ),
                )}
            </>
        );

        return mode === 'shelf' ? (
            <ShelfRow>{covers}</ShelfRow>
        ) : (
            <View style={styles.row}>{covers}</View>
        );
    }

    return (
        <View
            style={styles.container}
            onLayout={event =>
                setWidth(event.nativeEvent.layout.width)
            }
        >
            {width > 0 && (
                <FlatList
                    data={groupRows(games, columns)}
                    renderItem={renderRow}
                    keyExtractor={row => row[0].id}
                    contentContainerStyle={{
                        paddingTop: 8,
                        paddingBottom: bottomSpace,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
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