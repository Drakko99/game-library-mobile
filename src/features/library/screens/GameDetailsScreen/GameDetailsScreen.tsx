import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
} from 'react-native-reanimated';

import type { RootStackParams } from '@/app/navigation/navigation.types';
import { usePreferences } from '@/app/Preferences';
import { Action } from '@/components/Action/Action';
import { alpha } from '@/theme/theme';
import { libraryDemoItems } from '../../data/library.demo';
import { GameCover } from '../../components/GameCover/GameCover';
import { styles } from './GameDetailsScreen.styles';

/** Compone la ficha con fondo ambiental y movimiento ligado al scroll. */
export function GameDetailsScreen({
    route,
    navigation,
}: NativeStackScreenProps<RootStackParams, 'Game'>) {
    const game = libraryDemoItems.find(
        item => item.id === route.params.id,
    );

    const { preferences } = usePreferences();
    const insets = useSafeAreaInsets();
    const reduced = useReducedMotion();
    const offset = useSharedValue(0);

    // El scroll se procesa en el hilo de interfaz.
    // No provoca un renderizado de React en cada fotograma.
    const onScroll = useAnimatedScrollHandler({
        onScroll: event => {
            offset.set(event.contentOffset.y);
        },
    });

    // Limitamos el efecto para que la portada no se desplace indefinidamente.
    const posterMotion = useAnimatedStyle(() => {
        const progress =
            Math.min(240, Math.max(0, offset.get())) / 240;

        return {
            transform: [
                { translateY: reduced ? 0 : -24 * progress },
                { scale: reduced ? 1 : 1 - progress * 0.05 },
            ],
        };
    });

    /** Regresa a la colección conservando su búsqueda y pestaña. */
    function back() {
        navigation.goBack();
    }

    if (!game) {
        return (
            <View
                style={[
                    styles.root,
                    { paddingTop: insets.top + 24 },
                ]}
            >
                <Action
                    label="Volver"
                    icon="arrow-back"
                    onPress={back}
                />

                <Text style={styles.text}>
                    No se encontró este juego.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <View style={styles.backdrop} pointerEvents="none">
                <Image
                    source={{ uri: game.coverUrl }}
                    contentFit="cover"
                    blurRadius={14}
                    style={styles.fill}
                />

                <LinearGradient
                    colors={['#08080855', '#080808CC', '#080808']}
                    locations={[0, 0.6, 1]}
                    style={styles.fill}
                />
            </View>

            <Animated.ScrollView
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={[
                    styles.content,
                    {
                        paddingTop: insets.top + 12,
                        paddingBottom: insets.bottom + 40,
                    },
                ]}
            >
                <View style={styles.backButton}>
                    <Action
                        label="Biblioteca"
                        icon="arrow-back"
                        onPress={back}
                    />
                </View>

                <Animated.View
                    style={[
                        styles.poster,
                        posterMotion,
                        {
                            boxShadow: preferences.neon
                                ? `0 0 55px ${alpha(game.accent, 0.28)}`
                                : 'none',
                        },
                    ]}
                >
                    <GameCover game={game} />
                </Animated.View>

                <Text style={styles.title}>{game.title}</Text>

                <View style={styles.chips}>
                    {[game.platform, game.status].map(label => (
                        <View
                            key={label}
                            style={[
                                styles.chip,
                                {
                                    borderColor: alpha(game.accent, 0.5),
                                    backgroundColor: alpha(game.accent, 0.12),
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    color: game.accent,
                                    fontWeight: '600',
                                }}
                            >
                                {label}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.panel}>
                    <Text style={styles.panelTitle}>
                        En tu colección
                    </Text>

                    <Text style={styles.text}>
                        Plataforma: {game.platform}
                    </Text>

                    <Text style={styles.text}>
                        Estado: {game.status}
                    </Text>

                    <Text style={styles.note}>
                        Ficha de demostración. Los datos personales y las
                        notas llegarán desde tu API.
                    </Text>
                </View>
            </Animated.ScrollView>
        </View>
    );
}