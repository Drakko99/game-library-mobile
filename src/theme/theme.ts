export const theme = {
    background: '#080808',
    surface: '#151515',
    elevated: '#232323',

    text: '#F5F5F5',
    muted: '#A8A8A8',
    border: '#333333',
    glass: 'rgba(16,16,16,0.65)',

    accents: {
        red: '#FF3030',
        ice: '#55DFFF',
        gold: '#FFD166',
    },

    finishes: {
        obsidian: '#141414',
        graphite: '#292929',
        steel: '#394047',
    },
} as const;

/** Añade transparencia a un color hexadecimal de seis dígitos. */
export function alpha(hex: string, opacity: number): string {
    const value = Math.round(
        Math.max(0, Math.min(1, opacity)) * 255,
    );

    return `${hex}${value.toString(16).padStart(2, '0')}`;
}