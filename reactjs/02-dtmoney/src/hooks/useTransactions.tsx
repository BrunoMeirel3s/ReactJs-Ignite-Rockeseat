/**
 * O TransactionsContext será utilizado para realizar a comunicação com o nosso backEnd
 * e obter nossas transactions, utilizando o conceito de context conseguimos passar os valores
 * obtidos para diversos componentes diferentes.
 */
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { api } from "../services/api";

interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

/* Poderia ser desta forma também 
interface TransactionInput {
  title: string;
  amount: number;
  type: string;
  category: string;
}*/
//type TransactionInput = Pick<Transaction, 'title' | "amount" | 'type' | 'createdAt'>
type TransactionInput = Omit<Transaction, "id" | "createdAt">;

//Esta interface será necessária para dizer que o TransactionsProvider pode receber outros componentes dentro dele
//E assim passar seus valores para os demais componentes
interface TransactionsProviderProps {
  children: ReactNode;
}

/**
 * a interface TransactionsContextData irá nos permitir receber as transações
 *  e a função que irá enviar as transações para o backend, a função TransactionInput é
 * assincrona, desta forma retorna uma promise
 */
interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
}

/**
 * TransactionsContext criará o contexto que receberá e enviará as transações
 */
const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

/**
 * o TransactionsProvider irá retornar o elemento que passará os valores para os outros componentes
 * da aplicação
 */
export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  useEffect(() => {
    api
      .get("transactions")
      .then((response) => setTransactions(response.data.transactions));
  }, []);

  //Função que irá realizar o post para a api e salvar a transação, observe que estamos passando a mesma
  //através do Provider, dessa forma poderemos chama-la no componente que quisermos
  async function createTransaction(transactionInput: TransactionInput) {
    //response recebe os valores retornados pelo método post
    const response = await api.post("/transactions", {
      ...transactionInput,
      createdAt: new Date(),
    });

    //após passarmos os valores para response iremos setar as transactions com o novo valor inserido
    const { transaction } = response.data;

    //dessa forma as transações serão atualizadas automáticamente em toda nossa aplicação
    setTransactions([...transactions, transaction]);
  }
  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {/**Devemos passar o children para dizer que o TransactionsContext irá envolver outros elementos */}
      {children}
    </TransactionsContext.Provider>
  );
}

/**
 * Aqui estamos criando um hook para ser utilizado nos componentes que precisarem acessar o useTransactions
 * e obter os valores das transações
 */
export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}
