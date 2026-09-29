import type { PropsWithChildren } from 'react';
import {
    ScrollView,
    Pressable,
    Switch,
    Text,
    View,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { usePreferences } from '@/app/Preferences';
import { Action } from '@/components/Action/Action';
import { alpha } from '@/theme/theme';
import { styles } from './SettingsPanel.styles';

/** Comparte presentación y errores; cada pantalla decide qué ajustes contiene. */
export function SettingsPanel({
    title,
    onBack,
    closeLabel = 'Listo',
    bottomSpace,
    children,
}: PropsWithChildren<{
    title: string;
    onBack?: () => void;
    closeLabel?: string;
    bottomSpace?: number;
}>) {
    const insets = useSafeAreaInsets();
    const { storageError } = usePreferences();

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
                styles.content,
                {
                    paddingBottom:
                        bottomSpace ?? insets.bottom + 24,
                },
            ]}
        >
            {onBack && (
                <Action
                    label={closeLabel}
                    icon={
                        closeLabel === 'Listo'
                            ? 'checkmark'
                            : 'arrow-back'
                    }
                    onPress={onBack}
                />
            )}

            <Text style={styles.title}>{title}</Text>

            {children}

            {storageError && (
                <Text
                    accessibilityRole="alert"
                    style={styles.note}
                >
                    {storageError}
                </Text>
            )}
        </ScrollView>
    );
}

/** Agrupa controles relacionados bajo un título. */
export function SettingsSection({
    title,
    children,
}: PropsWithChildren<{ title: string }>) {
    return (
        <View style={styles.section}>
            <Text style={styles.heading}>{title}</Text>
            {children}
        </View>
    );
}

/** Permite que las opciones se ajusten al espacio y al tamaño del texto. */
export function Choices({ children }: PropsWithChildren) {
    return <View style={styles.choices}>{children}</View>;
}

/** Representa una opción exclusiva con borde, marca y color, nunca solo color. */
export function Choice({
    label,
    selected,
    onPress,
    color,
}: {
    label: string;
    selected: boolean;
    onPress: () => void;
    color?: string;
}) {
    const { accent } = usePreferences();

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={[
                styles.choice,
                {
                    borderColor: selected ? accent : '#414146',
                    backgroundColor: selected
                        ? alpha(accent, 0.12)
                        : '#171719',
                },
            ]}
        >
            {color && (
                <View
                    style={[
                        styles.swatch,
                        { backgroundColor: color },
                    ]}
                />
            )}

            <Text style={styles.label}>{label}</Text>

            <Ionicons
                name={
                    selected
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                }
                size={20}
                color={selected ? accent : '#85858E'}
            />
        </Pressable>
    );
}

/** Asocia una descripción legible al interruptor nativo. */
export function Toggle({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}) {
    const { accent } = usePreferences();

    return (
        <View style={styles.toggle}>
            <Text style={[styles.label, styles.flex]}>
                {label}
            </Text>

            <Switch
                accessibilityLabel={label}
                value={value}
                onValueChange={onChange}
                trackColor={{
                    false: '#424248',
                    true: alpha(accent, 0.6),
                }}
                thumbColor={value ? accent : '#DBDBE0'}
            />
        </View>
    );
}

/** Muestra una aclaración breve sin simular un control interactivo. */
export function SettingsNote({
    children,
}: PropsWithChildren) {
    return <Text style={styles.note}>{children}</Text>;
}