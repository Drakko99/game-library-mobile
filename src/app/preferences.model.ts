import { isHex, presets, type PresetId } from '@/theme/appPalette';
import { theme } from '@/theme/theme';

export type ViewMode = 'shelf' | 'grid' | 'list';
export type Finish = 'obsidian' | 'graphite' | 'steel' | 'walnut' | 'oak';
export interface Preferences {
    view: ViewMode;
    finish: Finish;
    shelves: boolean;
    light: 'off' | 'warm' | 'accent';
    neon: boolean;
    glass: boolean;
    columns: number;
    composition: 'aligned' | 'natural';
    facing: 'covers' | 'spines';
    order: string[];
    themeId: PresetId | 'custom';
    customBackground: string;
    customAccent: string;
}

export const defaults: Preferences = {
    view: 'shelf',
    finish: 'obsidian',
    shelves: true,
    light: 'accent',
    neon: true,
    glass: true,
    columns: 3,
    composition: 'aligned',
    facing: 'covers',
    order: [],
    themeId: 'ember',
    customBackground: '#080808',
    customAccent: '#FF3030',
};

/** Lee datos antiguos sin perder acento, material ni preferencias ya guardadas. */
export function decodePreferences(raw: string | null): Preferences {
    const value: unknown = raw ? JSON.parse(raw) : null;
    if (!value || typeof value !== 'object') return defaults;
    const data = value as Record<string, unknown>;
    const oldAccent = data.accent === 'ice' || data.accent === 'gold' ? data.accent : 'red';
    const validPreset = typeof data.themeId === 'string' && Object.hasOwn(presets, data.themeId);
    return {
        view: data.view === 'grid' || data.view === 'list' ? data.view : 'shelf',
        finish:
            typeof data.finish === 'string' &&
                ['graphite', 'steel', 'walnut', 'oak'].includes(data.finish)
                ? (data.finish as Finish)
                : 'obsidian',
        shelves: typeof data.shelves === 'boolean' ? data.shelves : true,
        light: data.light === 'off' || data.light === 'warm' ? data.light : 'accent',
        neon: typeof data.neon === 'boolean' ? data.neon : true,
        glass: typeof data.glass === 'boolean' ? data.glass : true,
        columns:
            typeof data.columns === 'number' && Number.isInteger(data.columns)
                ? Math.max(2, Math.min(6, data.columns))
                : 3,
        composition: data.composition === 'natural' ? 'natural' : 'aligned',
        facing: data.facing === 'spines' ? 'spines' : 'covers',
        order: Array.isArray(data.order)
            ? [...new Set(data.order.filter((id): id is string => typeof id === 'string'))]
            : [],
        themeId: validPreset
            ? (data.themeId as PresetId)
            : data.themeId === 'custom' || oldAccent !== 'red'
                ? 'custom'
                : 'ember',
        customBackground: isHex(data.customBackground) ? data.customBackground : '#080808',
        customAccent: isHex(data.customAccent) ? data.customAccent : theme.accents[oldAccent],
    };
}
