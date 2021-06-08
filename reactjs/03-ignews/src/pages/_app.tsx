import { AppProps } from "next/app";
import React from "react";
import { Header } from "../components/Header";
import "../styles/global.scss";

//Para utilizarmos estados globais o next também utiliza o contexto de context api para isso iremos usar o Provider do next
//aqui no _app que é o arquivo principal, os estados globais serão passados aqui no pageProps
import { Provider as NextAuthProvider } from "next-auth/client";

/**
 *
 */
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </NextAuthProvider>
  );
}

export default MyApp;
