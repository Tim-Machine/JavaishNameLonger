'use client'

import { ChakraProvider, extendTheme, type ThemeConfig } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {

    const config: ThemeConfig = {
        initialColorMode: 'light',
        useSystemColorMode: false,
    }

    const theme = extendTheme({ config })
    return <ChakraProvider theme={theme}>{children}</ChakraProvider>
}