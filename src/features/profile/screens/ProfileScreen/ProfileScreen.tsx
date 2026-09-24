import { ScrollView, Text, View } from 'react-native';
import {
    SafeAreaView,
    useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { BlurTargetView } from 'expo-blur';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useGlassTargets } from '@/app/navigation/GlassTargets';
import type { TabScreenProps } from '@/app/navigation/navigation.types';
import { usePreferences } from '@/app/Preferences';
import { Action } from '@/components/Action/Action';
import { libraryDemoItems } from '@/features/library/data/library.demo';
import { styles } from './ProfileScreen.styles';

/** Resume la colección y da acceso a las preferencias visuales. */
export function ProfileScreen({
    navigation,
}: TabScreenProps<'Profile'>) {
    const targets = useGlassTargets();
    const { accent } = usePreferences();
    const insets = useSafeAreaInsets();
    const barHeight = useBottomTabBarHeight();

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

    /** Abre las preferencias compartidas con la biblioteca. */
    function customize() {
        navigation.navigate('Customize');
    }

    return (
        <BlurTargetView ref={targets.Profile} style={styles.root}>
            <SafeAreaView
                edges={['top', 'left', 'right']}
                style={styles.root}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.content,
                        {
                            paddingBottom: barHeight + insets.bottom + 32,
                        },
                    ]}
                >
                    <View
                        style={[styles.avatar, { borderColor: accent }]}
                    >
                        <Ionicons
                            name="person-outline"
                            size={38}
                            color={accent}
                        />
                    </View>

                    <Text style={styles.title}>Tu perfil</Text>
                    <Text style={styles.subtitle}>
                        Colección de demostración
                    </Text>

                    <View style={styles.stats}>
                        {stats.map(stat => (
                            <View key={stat.label} style={styles.stat}>
                                <Text
                                    style={[styles.number, { color: accent }]}
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
                        label="Personalizar la aplicación"
                        icon="options-outline"
                        onPress={customize}
                    />

                    <Text style={styles.note}>
                        La cuenta real y la edición del perfil se conectarán
                        con la autenticación de tu API.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </BlurTargetView>
    );
}