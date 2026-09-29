import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '@/app/navigation/navigation.types';
import { usePreferences } from '@/app/Preferences';
import {
    SettingsPanel,
    SettingsSection,
    Choices,
    Choice,
    Toggle,
    SettingsNote,
} from '@/components/SettingsPanel/SettingsPanel';
import { LibraryPreview } from '../../components/LibraryCollection/LibraryCollection';
import { shelfMaterials } from '../../components/ShelfRow/shelfMaterials';
import { calculateLibraryLayout } from '../../libraryLayout';
import { libraryDemoItems } from '../../data/library.demo';
import { orderGames } from '../../libraryOrder';
import { styles } from './LibrarySettingsScreen.styles';

/** Configura la exposición y previsualiza exactamente el mismo renderizado de la biblioteca. */
export function LibrarySettingsScreen({
    navigation,
}: Readonly<NativeStackScreenProps<RootStackParams, 'LibrarySettings'>>) {
    const { preferences, update } = usePreferences();
    const [width, setWidth] = useState(0);
    const { fontScale } = useWindowDimensions();
    const layout = calculateLibraryLayout({
        width,
        columns: preferences.columns,
        mode: preferences.view,
        facing: preferences.facing,
        fontScale,
    });

    return (
        <SettingsPanel title="Diseño de la biblioteca" onBack={() => navigation.goBack()}>
            <SettingsSection title="Presentación">
                <Choices>
                    {(['shelf', 'grid', 'list'] as const).map((view, index) => (
                        <Choice
                            key={view}
                            label={['Estantería', 'Cuadrícula', 'Lista'][index]}
                            selected={preferences.view === view}
                            onPress={() => update({ view })}
                        />
                    ))}
                </Choices>
            </SettingsSection>

            <View style={styles.preview} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
                <LibraryPreview games={orderGames(libraryDemoItems, preferences.order)} />
            </View>

            {preferences.view !== 'list' && (
                <SettingsSection title="Juegos por fila">
                    <Choices>
                        {[2, 3, 4, 5, 6].map((columns) => (
                            <Choice
                                key={columns}
                                label={String(columns)}
                                selected={preferences.columns === columns}
                                onPress={() => update({ columns })}
                            />
                        ))}
                    </Choices>
                    <SettingsNote>
                        {width > 0 && layout.columns < preferences.columns
                            ? 'Has elegido ' +
                            preferences.columns +
                            '; en este ancho se muestran ' +
                            layout.columns +
                            ' para conservar un tamaño legible.'
                            : 'El tamaño se adapta al ancho disponible. En Lista se muestra un juego por fila.'}
                    </SettingsNote>
                </SettingsSection>
            )}

            {preferences.view === 'shelf' && (
                <>
                    <SettingsSection title="Orientación">
                        <Choices>
                            <Choice
                                label="Portadas"
                                selected={preferences.facing === 'covers'}
                                onPress={() => update({ facing: 'covers' })}
                            />
                            <Choice
                                label="Lomos"
                                selected={preferences.facing === 'spines'}
                                onPress={() => update({ facing: 'spines' })}
                            />
                        </Choices>
                        {preferences.facing === 'spines' && (
                            <SettingsNote>
                                Si no existe una imagen del lomo, se representa con el título y la plataforma. No
                                reproduce necesariamente la caja original.
                            </SettingsNote>
                        )}
                    </SettingsSection>
                    <SettingsSection title="Composición">
                        <Choices>
                            <Choice
                                label="Alineada"
                                selected={preferences.composition === 'aligned'}
                                onPress={() => update({ composition: 'aligned' })}
                            />
                            <Choice
                                label="Natural"
                                selected={preferences.composition === 'natural'}
                                onPress={() => update({ composition: 'natural' })}
                            />
                        </Choices>
                    </SettingsSection>
                    <Toggle
                        label="Mostrar baldas"
                        value={preferences.shelves}
                        onChange={(shelves) => update({ shelves })}
                    />
                    <SettingsSection title="Material">
                        <Choices>
                            {(Object.keys(shelfMaterials) as Array<keyof typeof shelfMaterials>).map((finish) => (
                                <Choice
                                    key={finish}
                                    label={shelfMaterials[finish].label}
                                    color={shelfMaterials[finish].front}
                                    selected={preferences.finish === finish}
                                    onPress={() => update({ finish })}
                                />
                            ))}
                        </Choices>
                    </SettingsSection>
                    <SettingsSection title="Luz de la estantería">
                        <Choices>
                            {(['off', 'warm', 'accent'] as const).map((light, index) => (
                                <Choice
                                    key={light}
                                    label={['Apagada', 'Cálida', 'Color de la app'][index]}
                                    selected={preferences.light === light}
                                    onPress={() => update({ light })}
                                />
                            ))}
                        </Choices>
                    </SettingsSection>
                </>
            )}
        </SettingsPanel>
    );
}