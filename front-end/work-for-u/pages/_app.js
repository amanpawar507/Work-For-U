import '../styles/globals.css'
import { Button, ChakraProvider, Container, HStack, Text } from "@chakra-ui/react"
import theme from '../theme'
import "@fontsource/roboto"
import {ErrorBoundary} from "react-error-boundary";
import UserContextProvider from '../components/contexts/userContext'
import { useRouter } from 'next/dist/client/router';


function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return <ChakraProvider theme={theme}>
    <ErrorBoundary
      FallbackComponent={Error}
      onReset={() => {
      router.push("/logout");
      }}

        
    >
      <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
    </ErrorBoundary>
  </ChakraProvider>

}

const Error = ({ error, componentStack, resetErrorBoundary }) => {





  return(
      <Container display={'flex'} justifyContent={'center'} flexDirection={'column'} h={'100vh'}>
          <Text w={'100%'} textAlign={'center'} fontSize={'xl'}>Oops! Something went wrong !</Text>
          <HStack w={'100%'} justifyContent={'center'} mt='20px'>
              <Button variant={'outline'} onClick={resetErrorBoundary} >Go to login</Button>
          </HStack>
      </Container>
  )
}

export default MyApp
