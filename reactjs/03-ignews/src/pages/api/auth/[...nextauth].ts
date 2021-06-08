import NextAuth from "next-auth";
import Providers from "next-auth/providers";

/**
 * Aqui iremos tratar a autenticação utilizando o GitHub, para isto criamos uma aplicação que terá
 * acesso a API de autenticação do GITHUB, lá nós pegamos o clientId e o secret que estão em nossa variável
 * local env.local, o campo scope é referente aos tipos de acesso que a nossa aplicação terá sobre a conta
 * do usuário, neste caso iremos utilizar apenas informações básicas
 */
export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user",
    }),
  ],
});
