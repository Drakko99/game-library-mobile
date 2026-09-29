import { usePreferences } from '@/app/Preferences';
import { useDockMetrics } from '@/app/navigation/useDockMetrics';
import { TabCanvas } from '@/components/TabCanvas/TabCanvas';

import {
    SettingsPanel,
    SettingsSection,
    Choices,
    Choice,
    Toggle,
    SettingsNote,
} from '@/components/SettingsPanel/SettingsPanel';

import { theme } from '@/theme/theme';

const colors = [
    { id: 'red', label: 'Rojo eléctrico' },
    { id: 'ice', label: 'Hielo' },
    { id: 'gold', label: 'Ámbar' },
] as const;

/** Reúne opciones globales; no modifica el material ni los datos del usuario. */
export function AppSettingsScreen() {
    const { preferences, update } = usePreferences();
    const { bottomSpace } = useDockMetrics();

    return (
        <TabCanvas tab="AppSettings">
            <SettingsPanel
                title="Ajustes de la app"
                bottomSpace={bottomSpace}
            >
                <SettingsSection title="Color de acento">
                    <Choices>
                        {colors.map(color => (
                            <Choice
                                key={color.id}
                                label={color.label}
                                color={theme.accents[color.id]}
                                selected={
                                    preferences.accent === color.id
                                }
                                onPress={() =>
                                    update({ accent: color.id })
                                }
                            />
                        ))}
                    </Choices>

                    <SettingsNote>
                        Se aplica a la navegación, los botones y
                        los controles de toda la app.
                    </SettingsNote>
                </SettingsSection>

                <SettingsSection title="Efectos">
                    <Toggle
                        label="Transparencia de la navegación"
                        value={preferences.glass}
                        onChange={glass => update({ glass })}
                    />

                    <Toggle
                        label="Resplandores neón"
                        value={preferences.neon}
                        onChange={neon => update({ neon })}
                    />
                </SettingsSection>

                <SettingsSection title="Notificaciones">
                    <SettingsNote>
                        Disponibles cuando conectemos los avisos
                        de lanzamientos. Por ahora no se solicitan
                        permisos ni se envían avisos.
                    </SettingsNote>
                </SettingsSection>
            </SettingsPanel>
        </TabCanvas>
    );
}