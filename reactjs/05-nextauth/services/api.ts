import axios from "axios";
/**
 * Nookies é uma biblioteca que nos permite trabalhar com os cookies do usuário
 * neste caso iremos utilizr essa bibliote para buscar os cookies do usuário
 * e passar o cookie 'nextauth.token' para passar como um header para as requisições
 * usando axios, para isso iremos usar esse token para cada requisição
 */
import { parseCookies } from "nookies";

const cookies = parseCookies();

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});
