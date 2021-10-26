/**
 * O contexto nos permite utilizar os valores aqui criados em outras partes
 * do nosso código, para isto iremos exportar um provider aqui de dentro que será
 * colocado por fora dos componentes que receberão o conteúdo daquele provider.
 */
import { createContext, ReactNode } from "react";
import { api } from "../services/api";

//Type do signIn, contendo usuário e senha
type SignInCredentials = {
  email: string;
  password: string;
};

/**
 * Tipo a ser utilizado no contexto como um todo, para isto precisamos
 * informar todos os dados, funções e demais que serão utilizados no contexto
 */
type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
};

//Criação do contexto
export const AuthContext = createContext({} as AuthContextData);

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
  const isAuthenticated = false;

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

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
