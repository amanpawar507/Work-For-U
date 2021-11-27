import '../styles/globals.css'
import { ChakraProvider } from "@chakra-ui/react"
import theme from '../theme'
import "@fontsource/roboto"
import UserContextProvider from '../components/contexts/userContext'

function MyApp({ Component, pageProps }) {
  return <ChakraProvider theme={theme}>
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  </ChakraProvider>

}

export default MyApp
