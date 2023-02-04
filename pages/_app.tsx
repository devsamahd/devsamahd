import '../styles/globals.css'
import '../styles/prism-dark.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Nav from '../components/Nav'
import Theme from '../components/theme'
import Footer from '../components/Footer'
import 'bootstrap/dist/css/bootstrap.css'
import Cursor from '../context/cursor'
import {useEffect} from 'react'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { ThemeProvider } from 'styled-components'
import theme from '../styles/theme'
export default function App({ Component, pageProps }: AppProps) {
  useEffect(()=>{
    Aos.init()
    import('bootstrap')
  },[])
  return (
    <ThemeProvider theme={theme}>
      <ChakraProvider theme={Theme}>
          <Cursor />
          <Nav />
          <Component {...pageProps} />
          <Footer />
        </ChakraProvider>
      </ThemeProvider>
    
  )
}