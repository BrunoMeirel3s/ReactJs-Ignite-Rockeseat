import { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../styles/theme";
import { SideVarDrawerProvider } from "../contexts/SideBarDrawerContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <SideVarDrawerProvider>
        <Component {...pageProps} />
      </SideVarDrawerProvider>
    </ChakraProvider>
  );
}

export default MyApp;
