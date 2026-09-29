import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Linking,
    Pressable,
    Text,
    View,
} from 'react-native';

import { Image } from 'expo-image';

import { usePreferences } from '@/app/Preferences';
import { useDockMetrics } from '@/app/navigation/useDockMetrics';
import { TabCanvas } from '@/components/TabCanvas/TabCanvas';
import { Action } from '@/components/Action/Action';
import { alpha } from '@/theme/theme';

import { useDiscovery } from '../../useDiscovery';
import type { DiscoveryKind } from '../../discovery.api';
import { styles } from './ExploreScreen.styles';

const sections: {
    id: DiscoveryKind;
    label: string;
    description: string;
}[] = [
        {
            id: 'trending',
            label: 'Tendencias',
            description: 'Popularidad por visitas en IGDB.',
        },
        {
            id: 'recent',
            label: 'Nuevos',
            description:
                'Primer lanzamiento registrado en los últimos 30 días.',
        },
        {
            id: 'upcoming',
            label: 'Próximos',
            description:
                'Próximos primeros lanzamientos registrados.',
        },
    ];

/** Presenta resultados reales de la API; los errores nunca se sustituyen por tendencias inventadas. */
export function ExploreScreen() {
    const [section, setSection] =
        useState<DiscoveryKind>('trending');

    const [linkError, setLinkError] =
        useState<string | null>(null);

    const { accent } = usePreferences();
    const { bottomSpace } = useDockMetrics();
    const { data, loading, error, retry } =
        useDiscovery(section);

    /** Abre solo enlaces HTTPS de IGDB y comunica cualquier fallo del sistema. */
    async function openGame(url: string) {
        try {
            const parsed = new URL(url);

            if (
                parsed.protocol !== 'https:' ||
                !['igdb.com', 'www.igdb.com'].includes(
                    parsed.hostname,
                )
            ) {
                throw new Error('Enlace no válido.');
            }

            setLinkError(null);
            await Linking.openURL(url);
        } catch {
            setLinkError(
                'No se pudo abrir la ficha de IGDB.',
            );
        }
    }

    return (
        <TabCanvas tab="Explore">
            <FlatList
                data={data?.results ?? []}
                keyExtractor={game => String(game.id)}
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: bottomSpace },
                ]}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>Explorar</Text>
                        <Text style={styles.note}>
                            Descubre tu próxima partida.
                        </Text>

                        <View style={styles.tabs}>
                            {sections.map(item => (
                                <Pressable
                                    key={item.id}
                                    onPress={() => setSection(item.id)}
                                    accessibilityRole="button"
                                    accessibilityState={{
                                        selected: item.id === section,
                                    }}
                                    style={[
                                        styles.tab,
                                        item.id === section && {
                                            borderColor: accent,
                                            backgroundColor: alpha(
                                                accent,
                                                0.15,
                                            ),
                                        },
                                    ]}
                                >
                                    <Text style={styles.tabLabel}>
                                        {item.id === section ? '• ' : ''}
                                        {item.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <Text style={styles.note}>
                            {
                                sections.find(
                                    item => item.id === section,
                                )?.description
                            }
                        </Text>

                        {linkError && (
                            <Text
                                accessibilityRole="alert"
                                style={styles.note}
                            >
                                {linkError}
                            </Text>
                        )}
                    </View>
                }
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator
                            color={accent}
                            accessibilityLabel="Cargando juegos"
                        />
                    ) : error ? (
                        <View style={styles.header}>
                            <Text
                                accessibilityRole="alert"
                                style={styles.note}
                            >
                                {error}
                            </Text>

                            <Action
                                label="Reintentar"
                                icon="refresh"
                                onPress={retry}
                            />
                        </View>
                    ) : (
                        <Text style={styles.note}>
                            No hay resultados disponibles en esta
                            categoría.
                        </Text>
                    )
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.poster}>
                            <Text style={styles.placeholder}>
                                Sin portada
                            </Text>

                            {item.coverUrl && (
                                <Image
                                    source={{ uri: item.coverUrl }}
                                    contentFit="cover"
                                    recyclingKey={String(item.id)}
                                    cachePolicy="memory-disk"
                                    style={styles.fill}
                                />
                            )}
                        </View>

                        <View style={styles.info}>
                            <Text style={styles.name}>
                                {item.name}
                            </Text>

                            <Text
                                style={styles.note}
                                numberOfLines={2}
                            >
                                {item.platforms.join(' · ') ||
                                    'Plataformas por confirmar'}
                            </Text>

                            <Text style={styles.note}>
                                {item.releaseYear ?? 'Año por confirmar'}
                            </Text>

                            {item.url && (
                                <Action
                                    label="Ver en IGDB"
                                    icon="open-outline"
                                    onPress={() =>
                                        void openGame(item.url!)
                                    }
                                />
                            )}
                        </View>
                    </View>
                )}
                ListFooterComponent={
                    data && (
                        <Text style={styles.note}>
                            Datos de IGDB · Consultados{' '}
                            {new Date(
                                data.updatedAt,
                            ).toLocaleString('es-ES')}
                        </Text>
                    )
                }
            />
        </TabCanvas>
    );
}