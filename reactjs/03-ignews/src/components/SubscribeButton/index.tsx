import { useSession, signIn } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";
import { useRouter } from "next/router";

interface SubscribeButtonProps {
  priceId: string;
}

/**
 * SubscribeButton será utilizado para realizar o processo de subscribe que é se inscrever na newslatter,
 * observe que estamos obtendo session de useSession lá do next-auth/client para identificarmos se o
 * usuário já possui uma sessão ativa, caso ele não possua chamamos a função signIn passando o signIn github
 */
export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const [session] = useSession();
  /**
   * Para realizarmos redirecionamento via função, como click de um botão por exemplo devemos
   * utilizar o useRouter
   */
  const router = useRouter();

  //função que irá realizar o processo de subscribe do usuário
  async function handleSubscribe() {
    //caso ele não esteja logado realizamos o processo de login do github
    if (!session) {
      signIn("github");
      return;
    }

    //caso ele tenha uma subscription ativa ele não pode mais se inscrever então direcionamos para o post
    if (session.activeSubscription) {
      router.push("/posts");
      return;
    }

    //criação do checkout session que é a realização da compra do produto
    try {
      const response = await api.post("/subscribe");
      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      //redireciona o usuário para a compra do produto
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }
  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
