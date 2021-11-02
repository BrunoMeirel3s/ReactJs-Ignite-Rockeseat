import axios, { AxiosError } from "axios";
import Router from "next/router";
/**
 * Nookies é uma biblioteca que nos permite trabalhar com os cookies do usuário
 * neste caso iremos utilizr essa bibliote para buscar os cookies do usuário
 * e passar o cookie 'nextauth.token' para passar como um header para as requisições
 * usando axios, para isso iremos usar esse token para cada requisição
 */
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { signOut } from "../contexts/AuthContext";
import { AuthTokenError } from "./errors/AuthTokenError";

//Será usado para realizar a atualização do cookie em somente um requisição
let isRefreshing = false;

//receberá as requisições enquanto a atualização do cookie está sendo feita
let failedRequestQueue = [];

/**
 * Criamos a função setupAPICLient com o propósito de receber
 *  o contexto no qual a mesma está sendo executada e desta forma
 * passar o contexto corretamente para as funções de parseCookies
 * e as demais que precisarem de contexto
 */
export function setupAPIClient(ctx = undefined) {
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "http://localhost:3333",
    headers: {
      Authorization: `Bearer ${cookies["nextauth.token"]}`,
    },
  });

  /**
   * api.interceptors será utilizado para tratar as requisições
   * no caso iremos tratar as requisições sem token ou com token inválido,
   * primeiramente essa função recebe a função que irá acontecer quando
   * o response for válido  após isso recebe a função que irá executar
   * caso o response seja inválido com erro.
   */
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      /**
       * Os if's abaixo executarão somente no erro 401 e caso o
       * código do erro seja token expired, fora isso será chamado
       * o método de signOut caso o erro não seja o token expired
       * e caso o erro seja  um diferente do 401 então o axios
       * exibirá o erro não iremos tratá-lo aqui
       */
      if (error.response?.status === 401) {
        if (error.response.data?.code === "token.expired") {
          //cookies recebe novamente a execução de parseCookies
          cookies = parseCookies(ctx);

          //Obtém o cookie de refresh do usuário
          const { "nextauth.refreshToken": refreshToken } = cookies;

          /**
           * originalConfig recebe a requisição feita pelo usuário, com todos
           * as informações, de cookies passados na requisição e outras informações
           */
          const originalConfig = error.config;

          //Se isRefreshing for false iremos entrar no if abaixo
          if (!isRefreshing) {
            isRefreshing = true;

            //realizamos uma requisição de refresh para atualizar o token
            api
              .post("/refresh", {
                refreshToken,
              })
              .then((response) => {
                //Após realizarmos a requisição de refresh nós setamos novamente os tokens com os novos valores
                const { token } = response.data;

                setCookie(ctx, "nextauth.token", token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: "/",
                });

                setCookie(
                  ctx,
                  "nextauth.refreshToken",
                  response.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: "/",
                  }
                );

                //Após setar os novos cookies também precisamos passar o novo cookie nas requisições
                api.defaults.headers["Authorization"] = `Bearer ${token}`;

                /**
                 * Após o final do processo de refreshToken realizamos a chamada
                 * da Promisse que irá realizar as requisições que entraram na fila
                 */
                failedRequestQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestQueue = [];
              })
              .catch((err) => {
                /**
                 * Caso o processo de refreshToken falhe iremos chamar a promise de falha
                 */
                failedRequestQueue.forEach((request) => request.onFailure(err));
                failedRequestQueue = [];

                /**
                 * Caso estejamos no lado do browser e tenha dado erro iremos
                 * realizar o processo de logout
                 */
                if (process.browser) {
                  signOut();
                }
              })
              .finally(() => {
                //Após todo o processo voltaremos isRefreshing para false
                isRefreshing = false;
              });
          }

          /**
           * A promisse abaixo será utilizada para o processo de 'enfileiramento' das requisições
           * enquanto o processo de refreshToken não é finalizado, pegamos a requisição e passamos
           * um novo token para a mesma, após isso chamamos o resolve e realizamos a requisição
           * novamente
           */
          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers["Authorization"] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          /**
           * Caso o processo de autenticação falhe no lado do servidor iremos
           * retornar o erro do tipo AuthTokenError que nós criamos
           * para que seja processado pelo withSSRAuth
           */
          if (process.browser) {
            signOut();
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
}
