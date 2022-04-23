import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

export const theme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: 'dark',
  } as ThemeConfig,
});
