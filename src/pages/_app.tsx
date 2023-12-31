import {ChakraProvider} from '@chakra-ui/react';
import {AppProps} from "next/app";
import {config} from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import moment from 'moment-timezone';
import 'moment/locale/es';
import {CartProvider} from '@/hooks/useCart';

config.autoAddCss = false;

const App = ({Component, pageProps}: AppProps) => {
  moment.locale('es');
  moment.tz.setDefault('America/Mexico_City');

  return (
    <ChakraProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </ChakraProvider>
  );
};

export default App;