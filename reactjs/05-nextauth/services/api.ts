import axios, { AxiosError } from "axios";
/**
 * Nookies é uma biblioteca que nos permite trabalhar com os cookies do usuário
 * neste caso iremos utilizr essa bibliote para buscar os cookies do usuário
 * e passar o cookie 'nextauth.token' para passar como um header para as requisições
 * usando axios, para isso iremos usar esse token para cada requisição
 */
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();

export const api = axios.create({
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
    //Erro de token inválido
    if (error.response?.status === 41) {
      if (error.response.data?.code === "token.expired") {
        //renovar o token
        cookies = parseCookies();

        //Obtém o cookie de refresh do usuário
        const { "nextauth.refreshToken": refreshToken } = cookies;

        //realizamos uma requisição de refresh para atualizar o token
        api
          .post("/refresh", {
            refreshToken,
          })
          .then((response) => {
            //Após realizarmos a requisição de refresh nós setamos novamente os tokens com os novos valores
            const { token } = response.data;
            setCookie(undefined, "nextauth.token", token, {
              maxAge: 60 * 60 * 24 * 30, // 30 days
              path: "/",
            });

            setCookie(
              undefined,
              "nextauth.refreshToken",
              response.data.refreshToken,
              {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/",
              }
            );

            //Após setar os novos cookies também precisamos passar o novo cookie nas requisições
            api.defaults.headers["Authorization"] = `Bearer ${token}`;
          });
      } else {
      }
    }
  }
);
