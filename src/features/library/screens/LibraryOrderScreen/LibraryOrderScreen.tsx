import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePreferences } from '@/app/Preferences';
import type { RootStackParams } from '@/app/navigation/navigation.types';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { alpha } from '@/theme/theme';
import { Action } from '@/components/Action/Action';
import { libraryDemoItems } from '../../data/library.demo';
import { orderGames, moveBefore } from '../../libraryOrder';
import { createStyles } from './LibraryOrderScreen.styles';

/** Ordena con botones o con dos toques; se aplica a estantería, cuadrícula y lista. */
export function LibraryOrderScreen({
    navigation,
}: Readonly<NativeStackScreenProps<RootStackParams, 'LibraryOrder'>>) {
    const { preferences, update, colors, accent, storageError } = usePreferences();
    const styles = useThemedStyles(createStyles);
    const [selected, setSelected] = useState<string | null>(null);
    const games = orderGames(libraryDemoItems, preferences.order);

    /** Recalcula desde el último estado para conservar varias pulsaciones rápidas. */
    function step(id: string, direction: -1 | 1) {
        update((current) => {
            const ids = orderGames(libraryDemoItems, current.order).map((game) => game.id);
            const index = ids.indexOf(id);
            const target = index + direction;
            if (index < 0 || target < 0 || target >= ids.length) return {};
            [ids[index], ids[target]] = [ids[target], ids[index]];
            return { order: ids };
        });
    }

    /** Inserta el seleccionado delante del destino; también funciona entre filas lejanas. */
    function place(target: string) {
        if (!selected) return;
        update((current) => ({
            order: moveBefore(
                orderGames(libraryDemoItems, current.order).map((game) => game.id),
                selected,
                target,
            ),
        }));
        setSelected(null);
    }

    return (
        <SafeAreaView style={styles.root}>
            <FlatList
                data={games}
                keyExtractor={(game) => game.id}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Action label="Listo" icon="checkmark" onPress={() => navigation.goBack()} />
                        <Text style={styles.title}>Ordenar biblioteca</Text>
                        <Text style={styles.note}>
                            Usa las flechas o selecciona un juego y toca otro para colocarlo delante. Los cambios
                            se guardan en este dispositivo.
                        </Text>
                        {selected && (
                            <Action label="Cancelar selección" icon="close" onPress={() => setSelected(null)} />
                        )}
                        {storageError && (
                            <Text accessibilityRole="alert" style={styles.note}>
                                {storageError}
                            </Text>
                        )}
                    </View>
                }
                renderItem={({ item, index }) => (
                    <View
                        style={[
                            styles.row,
                            selected === item.id && {
                                borderColor: accent,
                                backgroundColor: alpha(accent, 0.12),
                            },
                        ]}
                    >
                        <Pressable
                            style={styles.nameButton}
                            accessibilityRole="button"
                            accessibilityLabel={
                                selected && selected !== item.id
                                    ? 'Colocar el juego seleccionado antes de ' + item.title
                                    : 'Seleccionar ' + item.title
                            }
                            accessibilityState={{ selected: selected === item.id }}
                            onPress={() =>
                                selected && selected !== item.id
                                    ? place(item.id)
                                    : setSelected(selected ? null : item.id)
                            }
                        >
                            <Text style={styles.name}>
                                {index + 1}. {item.title}
                            </Text>
                            <Text style={styles.note}>
                                {selected === item.id
                                    ? 'Seleccionado'
                                    : selected
                                        ? 'Colocar delante'
                                        : item.platform}
                            </Text>
                        </Pressable>
                        {([-1, 1] as const).map((direction) => {
                            const disabled = direction === -1 ? index === 0 : index === games.length - 1;
                            return (
                                <Pressable
                                    key={direction}
                                    disabled={disabled}
                                    accessibilityRole="button"
                                    accessibilityState={{ disabled }}
                                    accessibilityLabel={(direction === -1 ? 'Subir ' : 'Bajar ') + item.title}
                                    onPress={() => step(item.id, direction)}
                                    style={({ pressed }) => [
                                        styles.arrow,
                                        { opacity: disabled ? 0.25 : pressed ? 0.6 : 1 },
                                    ]}
                                >
                                    <Ionicons
                                        name={direction === -1 ? 'arrow-up' : 'arrow-down'}
                                        size={22}
                                        color={colors.text}
                                    />
                                </Pressable>
                            );
                        })}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}