import type { GetServerSideProps, NextPage } from "next";
import styles from "../styles/Home.module.css";

import { useState, FormEvent, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { parseCookies } from "nookies";
import { withSSRGuest } from "../utils/withSSRGuest";

const Home: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const data = {
      email,
      password,
    };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Home;

/**
 * Como o getServerSideProps roda do lado do servidor iremos chama-lo aqui
 * para realizar o processo de verificação, caso o usuário já possua um token iremos
 * então direciona-lo para a página de dashboard, para isso usamos
 * a função withSSRGuest
 */
export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
