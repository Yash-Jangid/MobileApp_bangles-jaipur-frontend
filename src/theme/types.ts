export type ThemeMode = 'light' | 'dark';

export interface ColorToken {
    light: string;
    dark: string;
}

export interface ThemeColors {
    // Brand & Primitives
    primary: ColorToken;
    secondary: ColorToken;
    accent: ColorToken;

    // Semantic UI
    background: ColorToken;
    surface: ColorToken;
    surfaceHighlight: ColorToken;

    // Text
    textPrimary: ColorToken;
    textSecondary: ColorToken;
    textInverse: ColorToken;
    textInteractive: ColorToken; // For buttons

    // Interactive Elements
    buttonBackground: ColorToken;
    buttonText: ColorToken;

    // Status / Badges
    success: ColorToken; // Green badge
    error: ColorToken;   // Red price/error
    info: ColorToken;

    // Borders
    border: ColorToken;
    divider: ColorToken;
}

export interface TypographyToken {
    fontFamily: string;
    fontSize: number;
    fontWeight: '400' | '500' | '600' | '700' | 'bold' | 'normal';
    lineHeight?: number;
    letterSpacing?: number;
}

export interface ThemeTypography {
    h1: TypographyToken;
    h2: TypographyToken;
    h3: TypographyToken;
    body1: TypographyToken;
    body2: TypographyToken;
    caption: TypographyToken;
    button: TypographyToken;
}

export interface LayoutConfig {
    headerStyle: 'simple-centered' | 'logo-left-icons-right'; // 'simple' is old, 'logo-left' is zeraki
    showBottomTabs: boolean;
    cardStyle: 'standard' | 'zeraki-minimal';
    showLegacySections?: boolean;
}

export interface ThemeConfiguration {
    id: string;
    name: string;
    layoutMode: 'default' | 'zeraki'; // To easily toggle groups of settings
    colors: ThemeColors;
    typography: ThemeTypography;
    spacing: {
        unit: number; // e.g. 8
        screenPadding: number;
        cardPadding: number;
    };
    borderRadius: {
        small: number;
        medium: number;
        large: number;
        round: number;
    };
    layout: LayoutConfig;
}

export interface ProcessedTheme {
    // This is the flattened theme object that components will consume
    colors: { [K in keyof ThemeColors]: string };
    typography: ThemeTypography;
    spacing: ThemeConfiguration['spacing'];
    borderRadius: ThemeConfiguration['borderRadius'];
    layout: ThemeConfiguration['layout'];
    isDark: boolean;
    mode: ThemeMode;
}
