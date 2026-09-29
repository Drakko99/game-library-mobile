import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParams = {
    Main: undefined;
    LibrarySettings: undefined;
    UserSettings: undefined;
    Game: { id: string };
};

export type TabParams = {
    Library: undefined;
    Explore: undefined;
    Profile: undefined;
    AppSettings: undefined;
};

export type TabScreenProps<T extends keyof TabParams> =
    CompositeScreenProps<
        BottomTabScreenProps<TabParams, T>,
        NativeStackScreenProps<RootStackParams>
    >;