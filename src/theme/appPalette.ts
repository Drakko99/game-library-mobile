export const presets = {
    ember: { label: 'Rojo eléctrico', background: '#080808', accent: '#FF3030' },
    glacier: { label: 'Glaciar', background: '#0B1721', accent: '#55DFFF' },
    walnut: { label: 'Biblioteca clásica', background: '#241B16', accent: '#E9B76D' },
    paper: { label: 'Papel', background: '#F3EBDD', accent: '#9B3026' },
} as const;

export type PresetId = keyof typeof presets;
export interface AppColors {
    background: string;
    surface: string;
    elevated: string;
    text: string;
    muted: string;
    border: string;
    dark: boolean;
}

/** Acepta exclusivamente colores RGB completos, sin transparencias. */
export function isHex(value: unknown): value is string {
    return typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
}

/** Separa los tres canales RGB para calcular mezclas y contraste. */
function channels(hex: string): number[] {
    return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}

/** Mezcla dos colores; amount indica cuánto aporta el segundo. */
export function mix(a: string, b: string, amount: number): string {
    const target = channels(b);
    return (
        '#' +
        channels(a)
            .map((value, i) =>
                Math.round(value + (target[i] - value) * amount)
                    .toString(16)
                    .padStart(2, '0'),
            )
            .join('')
    );
}

/** Convierte sRGB a luminancia relativa para medir legibilidad. */
function luminance(hex: string): number {
    const rgb = channels(hex).map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

/** Calcula la relación de contraste entre dos colores opacos. */
export function contrast(a: string, b: string): number {
    const values = [luminance(a), luminance(b)].sort((x, y) => x - y);
    return (values[1] + 0.05) / (values[0] + 0.05);
}

/** Ajusta luminosidad cuando el acento elegido haría ilegibles los controles. */
function readable(accent: string, ink: string, backgrounds: string[]): string {
    for (let step = 0; step <= 100; step++) {
        const candidate = mix(accent, ink, step / 100);
        if (backgrounds.every((background) => contrast(candidate, background) >= 4.5)) return candidate;
    }
    return ink;
}

/** Deriva superficies y texto tanto para fondos claros como oscuros. */
export function createPalette(background: string, rawAccent: string) {
    const dark = contrast('#FFFFFF', background) >= contrast('#000000', background);
    const text = dark ? '#FFFFFF' : '#000000';
    // Las superficies se alejan del texto para conservar contraste en fondos intermedios.
    const base = dark ? '#000000' : '#FFFFFF';
    const surface = mix(background, base, 0.12);
    const elevated = mix(background, base, 0.24);
    const colors: AppColors = {
        background,
        surface,
        elevated,
        text,
        dark,
        muted: readable(mix(background, text, 0.68), text, [background, surface]),
        border: mix(background, text, 0.25),
    };
    return { colors, accent: readable(rawAccent, text, [background, surface, elevated]) };
}
