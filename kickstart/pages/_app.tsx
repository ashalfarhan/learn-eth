import type { AppProps } from 'next/app';
import { Web3ReactProvider } from '@web3-react/core';
import { useEagerConnect } from '@app/hooks';
import { ChakraProvider } from '@chakra-ui/react';
import { getLibrary, theme } from '@app/utils';
import { Layout } from '@app/components';

function Listeners() {
  useEagerConnect();
  return null;
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider theme={theme}>
        <Listeners />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
