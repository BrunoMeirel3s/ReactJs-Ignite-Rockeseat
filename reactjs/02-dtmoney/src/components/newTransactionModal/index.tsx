import Modal from "react-modal";
import { FormEvent, useState, useContext } from "react";
import closeImg from "../../assets/close.svg";
import incomeImg from "../../assets/income.svg";
import outcomeImg from "../../assets/outcome.svg";
import { Container, TransactionTypeContainer, RadioBox } from "./styles";

import { useTransactions } from "../../hooks/useTransactions";

interface NewTransactionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}
export function NewTransactionModal({
  isOpen,
  onRequestClose,
}: NewTransactionModalProps) {
  /**
   * createTransaction é a função passada lá no contexto, passamos a mesma atráves
   * do TransactionsContext.Provider, dessa forma podemos salvar a nova transação
   */
  const { createTransaction } = useTransactions();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");

  const [type, setType] = useState("deposit");

  //Função que será passada para o método submit do formulário
  async function handleCreateNewTransaction(event: FormEvent) {
    event.preventDefault();

    await createTransaction({
      title,
      amount,
      category,
      type,
    });

    //Aqui estamos rezetando os valores para quando abrirmos o modal novamente ele vir zerado
    setTitle("");
    setAmount(0);
    setCategory("");
    setType("deposit");

    //fecha o modal
    onRequestClose();
  }
  return (
    <>
      {/**
       * isOpen é o estado que irá dizer se o modal está aberto ou fechado, onRequestClose é a
       * função que será chamada para mudar o estado de isOpen para false e então fechar o modal,
       * overlayClassName recebe a classe que contém os estilos css para serem aplicados no fundo do modal
       * na tela sobre a qual o modal irá aparecer, className é a classe que irá ajustar os elementos do
       * modal em si
       */}
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
      >
        {/**
         * Botão responsável por fechar o modal
         */}
        <button
          type="button"
          onClick={onRequestClose}
          className="react-modal-close"
        >
          <img src={closeImg} alt="Fechar Modal" />
        </button>

        <Container onSubmit={handleCreateNewTransaction}>
          <h2>Cadastrar Transação</h2>

          <input
            placeholder="Título"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            value={amount == 0 ? "" : amount}
            onChange={(event) => setAmount(Number(event.target.value))}
          />

          <TransactionTypeContainer>
            {/**
             * isActive aqui no RadioBox é uma propriedade criada por nós, para
             * que seja passado informações para o styled component, sendo assim deve ser
             * recebido através de uma interface lá na criação do componente
             */}
            <RadioBox
              type="button"
              onClick={() => setType("deposit")}
              isActive={type === "deposit"}
              activeColor="green"
            >
              <img src={incomeImg} alt="Entrada" />
              <span>Entrada</span>
            </RadioBox>

            <RadioBox
              type="button"
              onClick={() => setType("withdraw")}
              isActive={type === "withdraw"}
              activeColor="red"
            >
              <img src={outcomeImg} alt="Saída" />
              <span>Saída</span>
            </RadioBox>
          </TransactionTypeContainer>
          <input
            placeholder="Categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />

          <button type="submit">Cadastrar</button>
        </Container>
      </Modal>
    </>
  );
}
