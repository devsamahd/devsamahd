import '../styles/globals.css'
import '../styles/prism-dark.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Nav from '../components/Nav'
import theme from '../components/theme'
import Footer from '../components/Footer'
import 'bootstrap/dist/css/bootstrap.css'
import Cursor from '../context/cursor'

export default function App({ Component, pageProps }: AppProps) {
  
  return (
      <ChakraProvider theme={theme}>
        <Cursor />
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
  )
}
