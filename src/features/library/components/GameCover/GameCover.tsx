import { useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';

import type { LibraryDisplayItem } from '../../types';
import { styles } from './GameCover.styles';

/** Muestra la carátula y una alternativa legible si falla la descarga. */
export function GameCover({
    game,
}: {
    game: LibraryDisplayItem;
}) {
    const [failedUrl, setFailedUrl] = useState<string | null>(null);

    /** Marca únicamente la dirección que no pudo cargarse. */
    function handleError() {
        setFailedUrl(game.coverUrl);
    }

    return (
        <View style={styles.frame}>
            <Text style={styles.fallback}>{game.title}</Text>

            {game.coverUrl !== failedUrl && (
                <Image
                    source={{ uri: game.coverUrl }}
                    style={styles.image}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    recyclingKey={game.coverUrl}
                    onError={handleError}
                    accessible={false}
                />
            )}
        </View>
    );
}