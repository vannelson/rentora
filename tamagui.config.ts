import { createAnimations } from '@tamagui/animations-react-native';
import { defaultConfig } from '@tamagui/config/v4';
import { createTamagui } from '@tamagui/core';

const animations = createAnimations({
  fast: { type: 'spring', damping: 20, mass: 1.2, stiffness: 250 },
  medium: { type: 'spring', damping: 10, mass: 0.9, stiffness: 100 },
  slow: { type: 'spring', damping: 20, stiffness: 60 },
  bouncy: { type: 'spring', damping: 9, stiffness: 120, mass: 0.8 },
});

export const config = createTamagui({
  ...defaultConfig,
  animations,
  defaultTheme: 'light',
  shouldAddPrefersColorTheme: false,
  themeClassNameOnRoot: false,
});

export default config;

export type Conf = typeof config;

// Augment the original source module so all Tamagui components pick up our tokens
declare module '@tamagui/web' {
  interface TamaguiCustomConfig extends Conf {}
}
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}
