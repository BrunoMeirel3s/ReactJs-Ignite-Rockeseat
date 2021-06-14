/**
 * O faunadb será utilizado para realizar inserções de dados em um banco chamado faunaDB, o mesmo
 * é recomendado para trabalhar com aplicações serveless, para isto criamos uma conta no site do faunadb e
 * então criamos um database, de lá obtivemos uma key para acessar o banco a mesma está salva no .env.local
 */
import { Client } from "faunadb";

export const fauna = new Client({
  secret: process.env.FAUNADB_KEY,
});
