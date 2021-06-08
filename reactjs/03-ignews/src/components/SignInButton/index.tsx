import styles from "./styles.module.scss";
import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";

//SignIn é a função que irá realizar o processo de login com o GitHub
//signOut irá realizar o processo de deslogar a sessão
import { signIn, signOut, useSession } from "next-auth/client";

export function SignInButton() {
  /**
   * session é desestruturado do hook useSession que nos é retornado pelo next-auth
   * o mesmo nós retorna diversas informações sobre a seção do usuário, no caso aqui iremos
   * utilizar o session para identificar se o usuário possui uma seção ativa
   */
  const [session] = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      {" "}
      <FaGithub color="#04d361" /> {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn("github")}
    >
      {" "}
      <FaGithub color="#eba417" /> Sign in with GitHub
    </button>
  );
}
