import { setupAPIClient } from "./api";
/**
 * Caso precisarmos realizar as requisições sem contexto podemos utilizar
 * a constante api que vem deste arquivo pois criamos o api com base no setupAPIClient
 * porém sem a necessidade de passagemd e contexto
 */
export const api = setupAPIClient();
