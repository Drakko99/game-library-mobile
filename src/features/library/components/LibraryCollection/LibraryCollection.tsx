import { useState } from 'react';
import { FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { usePreferences, type ViewMode } from '@/app/Preferences';
import type { LibraryDisplayItem } from '../../types';
import { calculateLibraryLayout } from '../../libraryLayout';
import { GameCover } from '../GameCover/GameCover';
import { GameSpine } from '../GameSpine/GameSpine';
import { ShelfRow } from '../ShelfRow/ShelfRow';
import { styles } from './LibraryCollection.styles';

type Props = Readonly<{
    games: LibraryDisplayItem[];
    bottomSpace: number;
    onOpen: (id: string) => void;
}>;

type RowProps = Readonly<{
    games: LibraryDisplayItem[];
    layout: ReturnType<typeof calculateLibraryLayout>;
    mode: ViewMode;
    onOpen?: (id: string) => void;
}>;

/** Agrupa sin mutar ni alterar el orden decidido por el usuario. */
function groupRows(games: LibraryDisplayItem[], columns: number) {
    const rows: LibraryDisplayItem[][] = [];
    for (let index = 0; index < games.length; index += columns) {
        rows.push(games.slice(index, index + columns));
    }
    return rows;
}

/** La inclinación depende del identificador: buscar o reordenar no la cambia. */
function naturalPose(id: string) {
    let hash = 0;
    for (const character of id) hash = (Math.imul(hash, 31) + character.charCodeAt(0)) >>> 0;
    return { angle: ((hash % 5) - 2) * 0.8, scale: 0.96 + ((hash >>> 3) % 3) * 0.02 };
}

/** Comparte la composición entre la biblioteca y su previsualización de ajustes. */
function LibraryRow({ games, layout, mode, onOpen }: RowProps) {
    const { preferences, accent, colors } = usePreferences();
    const shelf = mode === 'shelf';
    const spines = shelf && preferences.facing === 'spines';
    const natural = shelf && preferences.composition === 'natural';

    const content = games.map((game) => {
        const pose = natural ? naturalPose(game.id) : { angle: 0, scale: 1 };
        const visualWidth = spines
            ? layout.itemWidth
            : Math.max(Math.min(68, layout.itemWidth), layout.itemWidth * pose.scale);
        // Eleva solo la esquina que bajaría al girar para que apoye sobre la balda.
        const baseLift = (Math.sin((Math.abs(pose.angle) * Math.PI) / 180) * visualWidth) / 2;
        const physical = (
            <View
                style={[
                    styles.case,
                    {
                        width: visualWidth,
                        marginBottom: baseLift,
                        transform: [{ rotate: `${pose.angle}deg` }],
                    },
                ]}
            >
                {spines ? (
                    <GameSpine game={game} width={visualWidth} height={layout.spineHeight * pose.scale} />
                ) : (
                    <GameCover game={game} />
                )}
                {natural && !spines && <View pointerEvents="none" style={styles.caseEdge} />}
            </View>
        );

        return (
            <Pressable
                key={game.id}
                disabled={!onOpen}
                onPress={() => onOpen?.(game.id)}
                accessible
                accessibilityRole={onOpen ? 'button' : 'image'}
                accessibilityLabel={`${game.title}. ${game.platform}. ${game.status}.${onOpen ? ' Abrir ficha.' : ''}`}
                style={({ pressed }) => [
                    styles.cell,
                    { width: layout.itemWidth, opacity: pressed ? 0.72 : 1 },
                    shelf ? styles.shelfCell : mode === 'grid' ? styles.grid : styles.list,
                    !shelf && { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
            >
                {shelf ? (
                    physical
                ) : (
                    <View style={mode === 'list' ? styles.listCover : undefined}>
                        <GameCover game={game} />
                    </View>
                )}
                {!shelf && (
                    <View style={[styles.metadata, mode === 'list' && styles.listMetadata]}>
                        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
                            {game.title}
                        </Text>
                        <Text style={[styles.caption, { color: colors.muted }]} numberOfLines={2}>
                            {game.platform}
                        </Text>
                        <Text style={[styles.status, { color: accent }]}>{game.status}</Text>
                    </View>
                )}
            </Pressable>
        );
    });

    return shelf ? (
        <ShelfRow gap={layout.gap} sidePadding={layout.sidePadding}>
            {content}
        </ShelfRow>
    ) : (
        <View style={[styles.row, { gap: layout.gap }]}>{content}</View>
    );
}

/** Muestra una fila real sin anidar listas desplazables en los ajustes. */
export function LibraryPreview({ games }: Readonly<{ games: LibraryDisplayItem[] }>) {
    const { preferences } = usePreferences();
    const { fontScale } = useWindowDimensions();
    const [width, setWidth] = useState(0);
    const layout = calculateLibraryLayout({
        width,
        columns: preferences.columns,
        mode: preferences.view,
        facing: preferences.facing,
        fontScale,
    });
    return (
        <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
            {width > 0 && (
                <LibraryRow
                    games={games.slice(0, layout.columns)}
                    layout={layout}
                    mode={preferences.view}
                />
            )}
        </View>
    );
}

/** Virtualiza filas con tamaños adaptados, manteniendo libres los controles inferiores. */
export function LibraryCollection({ games, bottomSpace, onOpen }: Props) {
    const { preferences, colors } = usePreferences();
    const { fontScale } = useWindowDimensions();
    const [width, setWidth] = useState(0);
    const layout = calculateLibraryLayout({
        width,
        columns: preferences.columns,
        mode: preferences.view,
        facing: preferences.facing,
        fontScale,
    });
    return (
        <View style={styles.container} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
            {width > 0 && (
                <FlatList
                    key={`${preferences.view}-${layout.columns}-${preferences.facing}`}
                    data={groupRows(games, layout.columns)}
                    renderItem={({ item }) => (
                        <LibraryRow games={item} layout={layout} mode={preferences.view} onOpen={onOpen} />
                    )}
                    keyExtractor={(row) => row[0].id}
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: bottomSpace }}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="handled"
                    ListEmptyComponent={
                        <Text style={[styles.empty, { color: colors.muted }]}>
                            No hay juegos que coincidan.
                        </Text>
                    }
                />
            )}
        </View>
    );
}
