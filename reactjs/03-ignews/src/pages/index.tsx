//Tudo que for colocado no Head será adicionado ao Head lá do _document
import { GetServerSideProps, GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}
export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title> Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👋 Hey, welcome</span>
          <h1>
            News about the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  );
}

/**
 * Por o next realizar primeiramente o server side render nós precisamos consumir as informações
 * da API utilizando este getServerSideProps que irá realizar o processamento antes da página HTML
 * ser gerada para o cliente, e então iremos retornar a mesma como props para a nova página,
 *
 * porém utilizando o GetStaticProps podemos utilizar conteúdo HTML já renderizado pelo next, o que
 * nos permite diminuir a quantidade de requisições para o nosso backend
 */
export const getStaticProps: GetStaticProps = async () => {
  /**
   * price irá realizar uma requisição para a api do stripe pegando as Informações
   * referente aos pagamentos
   */
  const price = await stripe.prices.retrieve("price_1Izn0IKfj2GFQGrKR4uelmmx");

  /**
   * de dentro de price iremos pegar algumas informações do produto, como id, preço e etc, o preço por padrão
   * é setado como centavos, desta forma o mesmo precisa ser dividido por 100, utilizamos o Intl para realizar
   * a tipagem do valor transformando o em valor monetário
   */
  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  //Estamos retornando as props para o nosso componente index.tsx este mesmo no caso
  /**
   * revalidate será utilizado para que o next gere um novo conteúdo estático a cada tempo determinado
   */
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  };
};
