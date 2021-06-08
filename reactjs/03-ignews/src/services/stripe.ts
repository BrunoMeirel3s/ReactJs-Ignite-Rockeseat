/**
 * Stripe é a API que irá lidar com pagamentos em nosso projeto, para isso na API
 * nós obtivemos um key que está salvo em .env.local com o nome de STRIPE_API_KEY
 * sendo assim, o mesmo será utilizado para realizar a comunicação com a API
 */
import Stripe from "stripe";
import { version } from "../../package.json";

export const stripe = new Stripe(process.env.STRIPE_API_KEY, {
  apiVersion: "2020-08-27",
  appInfo: {
    name: "Ignews",
    version,
  },
});
