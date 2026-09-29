import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePreferences } from '@/app/Preferences';
import { useDockMetrics } from '@/app/navigation/useDockMetrics';
import { TabCanvas } from '@/components/TabCanvas/TabCanvas';
import { Action } from '@/components/Action/Action';
import {
    SettingsPanel,
    SettingsSection,
    SettingsNote,
    Toggle,
    Choice,
} from '@/components/SettingsPanel/SettingsPanel';
import { presets, isHex, createPalette, type PresetId } from '@/theme/appPalette';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { createStyles } from './AppSettingsScreen.styles';

/** Cambia toda la paleta y conserva aparte la combinación personal del usuario. */
export function AppSettingsScreen() {
    const { preferences, update, colors, accent } = usePreferences();
    const { bottomSpace } = useDockMetrics();
    const styles = useThemedStyles(createStyles);
    const [background, setBackground] = useState(preferences.customBackground);
    const [customAccent, setCustomAccent] = useState(preferences.customAccent);
    const valid = isHex(background) && isHex(customAccent);
    const preview = valid ? createPalette(background, customAccent) : null;

    /** Aplica solo colores completos; escribir un valor parcial no altera la app. */
    function applyCustom() {
        if (valid) update({ themeId: 'custom', customBackground: background, customAccent });
    }

    return (
        <TabCanvas tab="AppSettings">
            <SettingsPanel title="Ajustes de la app" bottomSpace={bottomSpace}>
                <SettingsSection title="Temas">
                    <View style={styles.themes}>
                        {(Object.keys(presets) as PresetId[]).map((id) => {
                            const preset = presets[id];
                            const palette = createPalette(preset.background, preset.accent);
                            const selected = preferences.themeId === id;
                            return (
                                <Pressable
                                    key={id}
                                    accessibilityRole="radio"
                                    accessibilityLabel={preset.label}
                                    accessibilityState={{ checked: selected }}
                                    onPress={() => update({ themeId: id })}
                                    style={({ pressed }) => [
                                        styles.card,
                                        { borderColor: selected ? accent : colors.border, opacity: pressed ? 0.75 : 1 },
                                    ]}
                                >
                                    <View style={[styles.preview, { backgroundColor: preset.background }]}>
                                        <View style={[styles.sampleLine, { backgroundColor: palette.colors.text }]} />
                                        <View style={[styles.sampleButton, { backgroundColor: palette.accent }]} />
                                    </View>
                                    <View style={styles.labelRow}>
                                        <Text style={styles.label}>{preset.label}</Text>
                                        <Ionicons
                                            name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                                            size={20}
                                            color={selected ? accent : colors.muted}
                                        />
                                    </View>
                                </Pressable>
                            );
                        })}
                    </View>
                    <Choice
                        label="Personalizado"
                        selected={preferences.themeId === 'custom'}
                        onPress={() => update({ themeId: 'custom' })}
                    />
                </SettingsSection>

                {preferences.themeId === 'custom' && (
                    <SettingsSection title="Tu combinación">
                        <Text style={styles.label}>Fondo · #RRGGBB</Text>
                        <TextInput
                            value={background}
                            onChangeText={setBackground}
                            maxLength={7}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            accessibilityLabel="Color del fondo en hexadecimal"
                            selectionColor={accent}
                            style={styles.input}
                        />
                        <Text style={styles.label}>Acento · #RRGGBB</Text>
                        <TextInput
                            value={customAccent}
                            onChangeText={setCustomAccent}
                            maxLength={7}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            accessibilityLabel="Color del acento en hexadecimal"
                            selectionColor={accent}
                            style={styles.input}
                        />
                        {preview && (
                            <View style={[styles.preview, { backgroundColor: background }]}>
                                <Text style={{ color: preview.colors.text, fontWeight: '700' }}>Tu biblioteca</Text>
                                <Text style={{ color: preview.accent }}>Así se verá el acento</Text>
                            </View>
                        )}
                        {valid ? (
                            <Action
                                label="Aplicar combinación"
                                icon="color-palette-outline"
                                onPress={applyCustom}
                            />
                        ) : (
                            <SettingsNote>
                                Escribe # seguido de seis caracteres hexadecimales, por ejemplo #18222C.
                            </SettingsNote>
                        )}
                        <SettingsNote>
                            El texto se adapta al fondo. Si falta contraste, se ajusta la luminosidad del acento
                            para mantenerlo legible.
                        </SettingsNote>
                    </SettingsSection>
                )}

                <SettingsSection title="Efectos">
                    <Toggle
                        label="Transparencia de la navegación"
                        value={preferences.glass}
                        onChange={(glass) => update({ glass })}
                    />
                    <Toggle
                        label="Resplandores neón"
                        value={preferences.neon}
                        onChange={(neon) => update({ neon })}
                    />
                </SettingsSection>
                <SettingsSection title="Notificaciones">
                    <SettingsNote>Se añadirán al conectar los avisos de lanzamientos.</SettingsNote>
                </SettingsSection>
            </SettingsPanel>
        </TabCanvas>
    );
}