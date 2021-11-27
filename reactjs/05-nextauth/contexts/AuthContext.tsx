/**
 * O contexto nos permite utilizar os valores aqui criados em outras partes
 * do nosso código, para isto iremos exportar um provider aqui de dentro que será
 * colocado por fora dos componentes que receberão o conteúdo daquele provider.
 */
import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies"; //Biblioteca para trabalhar com cookies no Next.js
import Router from "next/router"; //Utilizado para realizar o redirecionamento do usuário
import { api } from "../services/apiClient";

//Type do signIn, contendo usuário e senha
type SignInCredentials = {
  email: string;
  password: string;
};

/**
 * Type a ser utilizado para a criação do state referente
 * ao processo de login do usuário
 */
type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

/**
 * Tipo a ser utilizado no contexto como um todo, para isto precisamos
 * informar todos os dados, funções e demais que serão utilizados no contexto
 */
type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  isAuthenticated: boolean;
  user: User;
};

//Criação do contexto
export const AuthContext = createContext({} as AuthContextData);

//authChannel permite enviar mensagens que podem ser ouvidas por outras abas rodando a mesma aplicação
let authChannel: BroadcastChannel;

//Função para apagar os cookies e redirecionar
export function signOut() {
  //Como o nome sugere o destroy cookie apaga os cookies chamados
  destroyCookie(undefined, "nextauth.token");
  destroyCookie(undefined, "nextauth.refreshToken");

  //envio da mensagem 'signOut' podemos em outro lugar ouvir esta mensagem e tomar uma ação
  authChannel.postMessage("signOut");

  Router.push("/");
}

//type do AuthProvider, devemos informar que o AuthProvider receberá um children
type AuthProviderProps = {
  children: ReactNode;
};

/**
 * Aqui criamos o Provider que é quem passará os valores e funções para as demais partes da aplicação
 * Por fim devemos retornar o provider passando no value todos os dados que serão enviados
 * para os componentes que utilizarem este provider
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  /**
   * O useEffect abaixo será utilizado para ficar ouvindo a mensagem signOut
   * caso ele a ouça será executado a função signOut que irá realizar o loggof
   * na aplicação toda
   */
  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          break;
        default:
          break;
      }
    };
  }, []);

  /**
   * Usaremos o useEffect abaixo para buscarmos os cookies do usuário
   * principalmente o cookie nextauth.token que contém o token de login
   * do usuário, sendo assim, caso seja encontrado o token
   * iremos realizar uma requisição para '/me' que nos retorna os dados
   * do usuário atualmente logado
   */
  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response?.data;

          setUser({ email, permissions, roles });
        })
        .catch((error) => {
          signOut();
        });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      /**
       * Para validar o usuário e senha enviamos uma requisição
       * para o endereço de validação em nosso backend para isto
       * utilizamos o axios com a baseURL localhost:3333
       */
      const response = await api.post("sessions", {
        email,
        password,
      });

      /**
       * Abaixo estamos pegando as informações referente ao login
       * de response.data que é o retorno do processo de login
       */
      const { token, refreshToken, permissions, roles } = response.data;

      /**
       * Utilizamos a função setCookie para criarmos os cookies com as informações
       * "token" e "refreshToken" retornadas pelo nosso backend, passamos undefined
       * como primeiro parametro pois precisamos especificar o contexto no qual será
       * executado o setCookie, porém como o cookie será criado do lado do cliente
       * então passamos undefined, o segundo parametro é o nome do cookie
       */
      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days (Tempo de duração do cookie)
        path: "/", //Permite que todas as rotas tenham acesso ao cookie
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        email,
        permissions,
        roles,
      });

      //precisamos definir aqui também o header de Authorization com o token do usuário
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      //Router.push realiza o processo de redirecionamento do usuário para outras páginas
      Router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
