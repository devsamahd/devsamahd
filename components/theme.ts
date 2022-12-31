import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
}
const colors = {
  brand: {
    darkbg: "#222222",
    darkaccent:""
  }
}

const theme = extendTheme({ config, colors})

export default theme