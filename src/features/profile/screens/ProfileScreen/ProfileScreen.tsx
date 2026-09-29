import { ScrollView, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import type { TabScreenProps } from '@/app/navigation/navigation.types';
import { useDockMetrics } from '@/app/navigation/useDockMetrics';
import { usePreferences } from '@/app/Preferences';
import { useLocalProfile } from '../../LocalProfile';
import { TabCanvas } from '@/components/TabCanvas/TabCanvas';
import { Action } from '@/components/Action/Action';

import { libraryDemoItems } from '@/features/library/data/library.demo';
import { styles } from './ProfileScreen.styles';

/** Resume la colección y abre exclusivamente la configuración del usuario. */
export function ProfileScreen({
    navigation,
}: TabScreenProps<'Profile'>) {
    const { accent } = usePreferences();
    const { bottomSpace } = useDockMetrics();
    const profile = useLocalProfile();

    const stats = [
        {
            label: 'Juegos',
            value: libraryDemoItems.length,
        },
        {
            label: 'Jugando',
            value: libraryDemoItems.filter(
                game => game.status === 'Jugando',
            ).length,
        },
        {
            label: 'Completados',
            value: libraryDemoItems.filter(
                game => game.status === 'Completado',
            ).length,
        },
    ];

    return (
        <TabCanvas tab="Profile">
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: bottomSpace },
                ]}
            >
                <View
                    style={[
                        styles.avatar,
                        { borderColor: accent },
                    ]}
                >
                    <Ionicons
                        name="person-outline"
                        size={38}
                        color={accent}
                    />
                </View>

                <Text style={styles.title}>
                    {profile.value.username}
                </Text>

                <Text style={styles.subtitle}>
                    Perfil local · Colección de muestra
                </Text>

                <View style={styles.stats}>
                    {stats.map(stat => (
                        <View key={stat.label} style={styles.stat}>
                            <Text
                                style={[
                                    styles.number,
                                    { color: accent },
                                ]}
                            >
                                {stat.value}
                            </Text>

                            <Text style={styles.label}>
                                {stat.label}
                            </Text>
                        </View>
                    ))}
                </View>

                <Action
                    label="Ajustes del usuario"
                    icon="person-circle-outline"
                    onPress={() =>
                        navigation.navigate('UserSettings')
                    }
                />

                {profile.error && (
                    <Text
                        accessibilityRole="alert"
                        style={styles.note}
                    >
                        {profile.error}
                    </Text>
                )}
            </ScrollView>
        </TabCanvas>
    );
}