import { useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { alpha } from '@/theme/theme';
import type { LibraryDisplayItem } from '../../types';
import { styles } from './GameSpine.styles';

type Props = Readonly<{ game: LibraryDisplayItem; width: number; height: number }>;

/** Resume la plataforma y asigna una banda identificable sin copiar logotipos. */
function platformBand(platform: string) {
    const name = platform.toLowerCase();
    if (name.includes('playstation 5') || name.includes('ps5'))
        return { label: 'PS5', background: '#ECEDEF', color: '#17191B' };
    if (name.includes('playstation 4') || name.includes('ps4'))
        return { label: 'PS4', background: '#184EA6', color: '#FFFFFF' };
    if (name.includes('switch')) return { label: 'SWITCH', background: '#BE1822', color: '#FFFFFF' };
    if (name.includes('xbox')) return { label: 'XBOX', background: '#176331', color: '#FFFFFF' };
    return { label: platform, background: '#292E35', color: '#FFFFFF' };
}

/** Usa un canto de los datos o dibuja uno sintético con título y plataforma. */
export function GameSpine({ game, width, height }: Props) {
    const [failedUrl, setFailedUrl] = useState<string | null>(null);
    const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
    const band = platformBand(game.platform);
    const titleLength = height - 54;
    const titleThickness = width - 12;
    const imageUrl = game.spineUrl;

    /** Mantiene el canto sintético cuando una imagen concreta no puede descargarse. */
    function handleError() {
        setFailedUrl(imageUrl ?? null);
    }

    /** Oculta el diseño sintético solo cuando la imagen ya está disponible. */
    function handleLoad() {
        setLoadedUrl(imageUrl ?? null);
    }

    return (
        <View accessible={false} style={[styles.frame, { width, height }]}>
            <LinearGradient colors={[alpha(game.accent, 0.35), '#15191F']} style={styles.image} />
            <View style={[styles.platform, { backgroundColor: band.background }]}>
                <Text
                    numberOfLines={1}
                    maxFontSizeMultiplier={1.3}
                    style={[styles.platformText, { color: band.color }]}
                >
                    {band.label}
                </Text>
            </View>
            {/* El texto se compone en horizontal y gira; no se apilan letras sueltas. */}
            <View
                style={[
                    styles.titleBox,
                    {
                        width: titleLength,
                        height: titleThickness,
                        left: (width - titleLength) / 2,
                        top: 34 + (titleLength - titleThickness) / 2,
                        transform: [{ rotate: '90deg' }],
                    },
                ]}
            >
                <Text numberOfLines={1} maxFontSizeMultiplier={1.4} style={styles.title}>
                    {game.title}
                </Text>
            </View>
            <View style={[styles.bottom, { backgroundColor: game.accent }]} />
            {imageUrl && imageUrl !== failedUrl && (
                <Image
                    key={imageUrl}
                    source={{ uri: imageUrl }}
                    style={[
                        styles.image,
                        { backgroundColor: loadedUrl === imageUrl ? '#15191F' : 'transparent' },
                    ]}
                    contentFit="contain"
                    cachePolicy="memory-disk"
                    recyclingKey={imageUrl}
                    onLoad={handleLoad}
                    onError={handleError}
                    accessible={false}
                />
            )}
            <LinearGradient
                pointerEvents="none"
                colors={['#FFFFFF2B', '#FFFFFF00', '#00000055']}
                locations={[0, 0.25, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bevel}
            />
        </View>
    );
}