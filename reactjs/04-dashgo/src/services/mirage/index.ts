import { createServer, Model, Factory } from "miragejs";
import faker from "faker"; //faker é uma biblioteca utilizada para geração de dados fakes

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    //Os modelos são as tabelas do banco
    models: {
      //Passamos parcial para informar que nem todos os campos precisam ser informados
      user: Model.extend<Partial<User>>({}),
    },
    //factories são utilizados para realizar a criação de dados em massa
    factories: {
      user: Factory.extend({
        name(i) {
          return `User ${i + 1}`;
        },
        email() {
          return faker.internet.email().toLowerCase();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },
    /**
     * seeds realiza a criação de 200 usuários do factory 'user'
     */
    seeds(server) {
      server.createList("user", 10);
    },

    routes() {
      this.namespace = "api";
      this.timing = 750;
      this.get("/users");
      this.post("/users");
      this.namespace = "";
      this.passthrough();
    },
  });

  return server;
}

//
