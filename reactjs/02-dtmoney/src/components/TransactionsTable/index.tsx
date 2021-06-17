import { useTransactions } from "../../hooks/useTransactions";
import { Container } from "./styles";

export function TransactionTable() {
  /**
   * Agora estamos pegando as transações do nosso contexto, e através dele é repassado
   * as transações e a função para salvar uma nova transação, sendo assim precisamos
   * desestruturar somente o valor que iremos utilizar aqui que é o transactions
   */
  const { transactions } = useTransactions();

  return (
    <Container>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td className={transaction.type}>
                {/**
                 * o Intl é uma biblioteca padrão do browser para trabalhar formatos
                 * nos exemplos aqui estamos ajustando os formatos de moeda e data
                 */}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(transaction.amount)}
              </td>
              <td>{transaction.category}</td>
              <td>
                {new Intl.DateTimeFormat("pt-BR").format(
                  new Date(transaction.createdAt)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
