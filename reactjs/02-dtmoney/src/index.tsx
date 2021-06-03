import React from "react";
import ReactDOM from "react-dom";
import { createServer, Model } from "miragejs";
import { App } from "./App";

createServer({
  /**
   * Dentro do createServer do miragejs podemos criar modelos que seriam bancos de dados,
   * abaixo estamos criado o banco(schema) "transaction"
   */
  models: {
    transaction: Model,
  },
  /**
   * Podemos também criar valores iniciais para popular os valores dos nossos schemas,
   * abaixo estamos populando o schema transaction
   */
  seeds(server) {
    server.db.loadData({
      transactions: [
        {
          id: 1,
          title: "Freelance de website",
          type: "deposit",
          category: "Dev",
          amount: 6000,
          createdAt: new Date("2021-02-12 09:00:00"),
        },
        {
          id: 2,
          title: "Aluguel",
          type: "withdraw",
          category: "Casa",
          amount: 1100,
          createdAt: new Date("2021-02-14 11:00:00"),
        },
      ],
    });
  },
  routes() {
    this.namespace = "api";
    this.get("/transactions", () => {
      //retornando todos os valores do schema transaction
      return this.schema.all("transaction");
    });

    this.post("/transactions", (schema, request) => {
      //data será o valor recebido pela api
      const data = JSON.parse(request.requestBody);
      //retorna a criação da transaction no schema 'transaction' inserindo o data
      return schema.create("transaction", data);
    });
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
