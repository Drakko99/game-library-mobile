import { useState } from 'react';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParams } from '@/app/navigation/navigation.types';
import { usePreferences } from '@/app/Preferences';
import { useLocalProfile } from '@/features/profile/LocalProfile';
import { Action } from '@/components/Action/Action';
import {
    SettingsPanel,
    SettingsSection,
    SettingsNote,
} from '@/components/SettingsPanel/SettingsPanel';
import { styles } from './UserSettingsScreen.styles';

/** Edita el nombre local sin simular cambios en una cuenta del servidor. */
export function UserSettingsScreen({
    navigation,
}: NativeStackScreenProps<
    RootStackParams,
    'UserSettings'
>) {
    const profile = useLocalProfile();
    const { accent } = usePreferences();

    const [name, setName] = useState(
        profile.value.username,
    );

    const valid =
        name.trim().length >= 3 &&
        name.trim().length <= 30;

    /** Aplica el nombre; el proveedor informa de posibles errores de guardado. */
    function save() {
        if (!valid) return;

        profile.update({ username: name.trim() });
        navigation.goBack();
    }

    return (
        <SafeAreaView
            style={styles.root}
            edges={['top', 'left', 'right']}
        >
            <SettingsPanel
                title="Ajustes del usuario"
                closeLabel="Volver"
                onBack={() => navigation.goBack()}
            >
                <SettingsSection title="Nombre de usuario">
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        maxLength={30}
                        accessibilityLabel="Nombre de usuario"
                        autoCorrect={false}
                        autoCapitalize="none"
                        selectionColor={accent}
                        style={[
                            styles.input,
                            { borderColor: accent },
                        ]}
                    />

                    <SettingsNote>
                        Entre 3 y 30 caracteres. En este prototipo
                        se guarda solo en este dispositivo.
                    </SettingsNote>

                    {valid && (
                        <Action
                            label="Aplicar nombre"
                            icon="checkmark"
                            onPress={save}
                        />
                    )}
                </SettingsSection>

                <SettingsSection title="Cuenta">
                    <SettingsNote>
                        Email y contraseña se añadirán al conectar
                        la sesión de usuario con la API.
                    </SettingsNote>
                </SettingsSection>

                {profile.error && (
                    <SettingsNote>{profile.error}</SettingsNote>
                )}
            </SettingsPanel>
        </SafeAreaView>
    );
}