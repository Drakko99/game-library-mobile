import type { PropsWithChildren } from 'react';
import {
    Pressable,
    ScrollView,
    Switch,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParams } from '@/app/navigation/navigation.types';
import {
    usePreferences,
    type ViewMode,
} from '@/app/Preferences';
import { Action } from '@/components/Action/Action';
import { theme, alpha } from '@/theme/theme';
import { styles } from './CustomizeScreen.styles';

interface ChoiceProps extends PropsWithChildren {
    label: string;
    selected: boolean;
    onPress: () => void;
}

/** Presenta una opción accesible con su muestra visual. */
function Choice({
    label,
    selected,
    onPress,
    children,
}: ChoiceProps) {
    const { accent } = usePreferences();

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={label}
            style={[
                styles.choice,
                {
                    borderColor: selected ? accent : theme.border,
                    backgroundColor: selected
                        ? alpha(accent, 0.1)
                        : theme.surface,
                },
            ]}
        >
            {children}

            <Text
                style={[
                    styles.choiceLabel,
                    { color: selected ? accent : theme.text },
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

/** Dibuja una miniatura que explica visualmente cada modo. */
function LayoutPreview({ mode }: { mode: ViewMode }) {
    const { accent } = usePreferences();

    return (
        <View style={styles.preview} accessible={false}>
            {[0, 1].map(row => (
                <View
                    key={row}
                    style={[
                        styles.previewRow,
                        mode === 'shelf' && styles.previewShelf,
                    ]}
                >
                    {Array.from(
                        { length: mode === 'list' ? 1 : 3 },
                        (_, column) => (
                            <View
                                key={column}
                                style={[
                                    styles.miniCover,
                                    { backgroundColor: alpha(accent, 0.7) },
                                ]}
                            />
                        ),
                    )}

                    {mode === 'list' && <View style={styles.miniText} />}
                </View>
            ))}
        </View>
    );
}

/** Cambia vista, material, acento y luz desde una hoja deslizable. */
export function CustomizeScreen({
    navigation,
}: NativeStackScreenProps<RootStackParams, 'Customize'>) {
    const {
        preferences,
        update,
        accent,
        storageError,
    } = usePreferences();

    const insets = useSafeAreaInsets();

    /** Cierra la hoja; los cambios ya se han aplicado. */
    function close() {
        navigation.goBack();
    }

    return (
        <ScrollView
            style={styles.root}
            contentContainerStyle={[
                styles.content,
                { paddingBottom: insets.bottom + 28 },
            ]}
        >
            <View style={styles.heading}>
                <Text style={styles.title}>Tu expositor</Text>

                <Action
                    label="Listo"
                    icon="checkmark"
                    onPress={close}
                />
            </View>

            <Text style={styles.subtitle}>
                Los cambios se aplican al instante.
            </Text>

            <Text style={styles.sectionTitle}>
                Vista de la colección
            </Text>

            <View style={styles.options}>
                {(['shelf', 'grid', 'list'] as const).map(mode => (
                    <Choice
                        key={mode}
                        label={{
                            shelf: 'Estantería',
                            grid: 'Cuadrícula',
                            list: 'Lista',
                        }[mode]}
                        selected={preferences.view === mode}
                        onPress={() => update({ view: mode })}
                    >
                        <LayoutPreview mode={mode} />
                    </Choice>
                ))}
            </View>

            <Text style={styles.sectionTitle}>
                Acabado de las baldas
            </Text>

            <Text style={styles.subtitle}>
                Visible en el modo estantería.
            </Text>

            <View style={styles.options}>
                {(['obsidian', 'graphite', 'steel'] as const).map(
                    finish => (
                        <Choice
                            key={finish}
                            label={{
                                obsidian: 'Obsidiana',
                                graphite: 'Grafito',
                                steel: 'Acero',
                            }[finish]}
                            selected={preferences.finish === finish}
                            onPress={() => update({ finish })}
                        >
                            <View
                                style={[
                                    styles.swatch,
                                    { backgroundColor: theme.finishes[finish] },
                                ]}
                            />
                        </Choice>
                    ),
                )}
            </View>

            <Text style={styles.sectionTitle}>
                Color de la interfaz
            </Text>

            <View style={styles.options}>
                {(['red', 'ice', 'gold'] as const).map(color => (
                    <Choice
                        key={color}
                        label={{
                            red: 'Rojo',
                            ice: 'Hielo',
                            gold: 'Oro',
                        }[color]}
                        selected={preferences.accent === color}
                        onPress={() => update({ accent: color })}
                    >
                        <View
                            style={[
                                styles.swatch,
                                { backgroundColor: theme.accents[color] },
                            ]}
                        />
                    </Choice>
                ))}
            </View>

            <View style={styles.toggle}>
                <Text style={styles.toggleLabel}>
                    Iluminación neón
                </Text>

                <Switch
                    value={preferences.neon}
                    onValueChange={neon => update({ neon })}
                    trackColor={{
                        false: theme.border,
                        true: alpha(accent, 0.55),
                    }}
                    thumbColor={
                        preferences.neon ? accent : theme.muted
                    }
                    accessibilityLabel="Iluminación neón"
                />
            </View>

            {storageError && (
                <Text style={styles.error} accessibilityRole="alert">
                    {storageError}
                </Text>
            )}
        </ScrollView>
    );
}