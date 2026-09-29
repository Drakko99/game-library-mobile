import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParams } from '@/app/navigation/navigation.types';
import {
    usePreferences,
    type ViewMode,
} from '@/app/Preferences';

import {
    SettingsPanel,
    SettingsSection,
    Choices,
    Choice,
    Toggle,
    SettingsNote,
} from '@/components/SettingsPanel/SettingsPanel';

import { ShelfRow } from '../../components/ShelfRow/ShelfRow';
import { shelfMaterials } from '../../components/ShelfRow/shelfMaterials';
import { GameCover } from '../../components/GameCover/GameCover';
import { libraryDemoItems } from '../../data/library.demo';
import { styles } from './LibrarySettingsScreen.styles';

const views: { id: ViewMode; label: string }[] = [
    { id: 'shelf', label: 'Estantería' },
    { id: 'grid', label: 'Cuadrícula' },
    { id: 'list', label: 'Lista' },
];

/** Cambia únicamente la exposición de la colección y muestra el material real. */
export function LibrarySettingsScreen({
    navigation,
}: NativeStackScreenProps<
    RootStackParams,
    'LibrarySettings'
>) {
    const { preferences, update } = usePreferences();

    return (
        <SettingsPanel
            title="Diseño de la biblioteca"
            onBack={() => navigation.goBack()}
        >
            <SettingsSection title="Presentación">
                <Choices>
                    {views.map(view => (
                        <Choice
                            key={view.id}
                            label={view.label}
                            selected={preferences.view === view.id}
                            onPress={() => update({ view: view.id })}
                        />
                    ))}
                </Choices>
            </SettingsSection>

            {preferences.view === 'shelf' ? (
                <>
                    <View style={styles.preview}>
                        <ShelfRow>
                            {libraryDemoItems
                                .slice(0, 3)
                                .map(game => (
                                    <View
                                        key={game.id}
                                        style={styles.cover}
                                    >
                                        <GameCover game={game} />
                                    </View>
                                ))}
                        </ShelfRow>
                    </View>

                    <Toggle
                        label="Mostrar baldas"
                        value={preferences.shelves}
                        onChange={shelves => update({ shelves })}
                    />

                    <SettingsSection title="Material">
                        <Choices>
                            {(
                                Object.keys(shelfMaterials) as Array<
                                    keyof typeof shelfMaterials
                                >
                            ).map(finish => (
                                <Choice
                                    key={finish}
                                    label={shelfMaterials[finish].label}
                                    color={shelfMaterials[finish].front}
                                    selected={
                                        preferences.finish === finish
                                    }
                                    onPress={() => update({ finish })}
                                />
                            ))}
                        </Choices>
                    </SettingsSection>

                    <SettingsSection title="Luz de la estantería">
                        <Choices>
                            <Choice
                                label="Apagada"
                                selected={preferences.light === 'off'}
                                onPress={() =>
                                    update({ light: 'off' })
                                }
                            />

                            <Choice
                                label="Cálida"
                                selected={preferences.light === 'warm'}
                                onPress={() =>
                                    update({ light: 'warm' })
                                }
                            />

                            <Choice
                                label="Color de la app"
                                selected={
                                    preferences.light === 'accent'
                                }
                                onPress={() =>
                                    update({ light: 'accent' })
                                }
                            />
                        </Choices>
                    </SettingsSection>
                </>
            ) : (
                <SettingsNote>
                    Las baldas, materiales y luces se configuran
                    en el modo Estantería.
                </SettingsNote>
            )}
        </SettingsPanel>
    );
}