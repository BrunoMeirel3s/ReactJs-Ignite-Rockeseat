import { NextApiRequest, NextApiResponse } from "next";

//getSession será utilizado pelo nosso backend para pegar as informações da seção do usuário
import { getSession } from "next-auth/client";
import { fauna } from "../../services/fauna";
import { query as q } from "faunadb";

import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: { stripe_customer_id: string };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    /**
     * getSession aqui pega as informações o usuário salvo nos cookies do navegador do mesmo
     * após ele realizar o processo de login na aplicação
     */
    const session = await getSession({ req });

    //obter informações do usuário no fauna com base no email
    const user = await fauna.query<User>(
      q.Get(q.Match(q.Index("user_by_email"), q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      /**
       * Para identificarmos os nossos clientes no stripe nós criamos uma conta de cliente para os mesmos
       * por isso que obtemos informações da seção do usuário, no caso iremos utilizar o campo de e-mail
       */
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        //metadata
      });

      //Realizando o update do usuário no faundaDB inserindo o stripeCustomerId
      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user.ref.id), {
          data: { stripe_customer_id: stripeCustomer.id },
        })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1Izn0IKfj2GFQGrKR4uelmmx", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    /**
     * Por fim ao realizar o processo de checkout do pagamento iremos retornar o id da seção
     */
    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
