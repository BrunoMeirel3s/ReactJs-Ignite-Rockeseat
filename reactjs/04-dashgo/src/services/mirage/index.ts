import {
  createServer,
  Model,
  Factory,
  Response,
  ActiveModelSerializer,
} from "miragejs";
import faker from "faker"; //faker é uma biblioteca utilizada para geração de dados fakes

type User = {
  name: string;
  email: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

    //Os modelos são as tabelas do banco
    models: {
      //Passamos parcial para informar que nem todos os campos precisam ser informados
      user: Model.extend<Partial<User>>({}),
    },
    //factories são utilizados para realizar a criação de dados em massa
    factories: {
      user: Factory.extend({
        name(i) {
          return `user ${i + 1}`;
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
      server.createList("user", 200);
    },

    routes() {
      this.namespace = "api";
      this.timing = 750;
      this.get("/users", function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams;

        const total = schema.all("user").length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const users = this.serialize(schema.all("user")).users.slice(
          pageStart,
          pageEnd
        );

        return new Response(200, { "x-total-count": String(total) }, { users });
      });
      this.get("/users/:id");
      this.post("/users");
      this.namespace = "";
      this.passthrough();
    },
  });

  return server;
}

//
