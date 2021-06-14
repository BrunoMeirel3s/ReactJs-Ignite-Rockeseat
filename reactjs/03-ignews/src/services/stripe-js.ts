/**
 * Serviço que será utilizado para realizar comunicação com o stripe via frontEnd, para realizar
 * as comunicações públicas com o stripe
 */

import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  return stripeJs;
}
