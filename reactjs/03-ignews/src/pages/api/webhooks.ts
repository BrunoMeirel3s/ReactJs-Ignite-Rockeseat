/**
 * Webhooks é o conceito utilizado para ficar ouvindo os hooks das apis com as quais o nosso sistema
 * faz integração, nesta aplicação iremos observar eventos que ocorrem lá da stripe, para isso criamos'
 * essa webhooks que irá ficar ouvindo os eventos da nossa conta lá na stripe e então iremos
 * realizar diversas ações tais como gravar o usuário no banco, atualizar o usuário e a subscription
 */

import { Stripe } from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/managerSubscription";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

/**
 * Iremos receber os webhooks do stripe como um stream e por isso criamos esse arquivo config para que o next
 * entenda que a api irá receber dados via stream
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

//eventos que iremos ouvir da stripe
const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const buf = await buffer(req);

    //ao enviar os eventos para nós a stripe manda uma key que deve ser verificada
    const secret = req.headers["stripe-signature"];

    let event: Stripe.Event;
    //verirficando se o evento veio da stripe
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      try {
        switch (type) {
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;

            //Ao ouvirmos os eventos acima iremos disparar a ação abaixo
            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false
            );

            break;
          case "checkout.session.completed":
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;
          default:
            throw new Error("Unhandled event");
        }
      } catch (err) {
        return res.json({ error: "Webhook handler failed" });
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
