/**
 * Next-auth é uma forma de realizar a autenticação, lembrando que neste caso estamos utilizando
 * a tecnologia OAuth para realizarmos login utilizando o sistema de login do github
 */
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import { fauna } from "../../../services/fauna";
import { query as q } from "faunadb";

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

  //As callbacks são executadas sempre que é realizado um processo, no caso abaixo iremos pegar a ação de login,
  // no caso abaixo estamos obtendo as informações do usuário ao logar e após isso inserindo no nosso banco do faunaDB
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },
    async signIn(user, account, profile) {
      const { email } = user;
      try {
        /**
         * Aqui neste try iremos checar se o usuário que está realizando o login já possui ou não uma conta
         * salva em nosso banco de dados, com base no indice salvo lá no banco, caso ele não tenha iremos
         * criar as informações do mesmo no banco senão iremos apenas obter as informações do usuário
         */
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(q.Index("user_by_email"), q.Casefold(user.email))
              )
            ),
            //caso não tenha conta iremos inserir no banco
            q.Create(q.Collection("users"), { data: { email: email } }),
            //caso tenha conta iremos apenas obter as informações
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(user.email)))
          )
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
