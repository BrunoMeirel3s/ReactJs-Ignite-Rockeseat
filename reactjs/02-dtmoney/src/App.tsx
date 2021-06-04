import React from "react";
import Modal from "react-modal";
import { useState } from "react";
import { GlobalStyle } from "./styles/global";
import { Header } from "./components/Header";
import { Dashboard } from "./components/dashboard";
import { NewTransactionModal } from "./components/newTransactionModal";
import { TransactionsProvider } from "./hooks/useTransactions";

Modal.setAppElement("#root");

export function App() {
  const [isNewTransactionModalOpen, setIsTransactionModalOpen] =
    useState(false);

  function handleOpenNewTransactionModal() {
    setIsTransactionModalOpen(true);
  }
  function handleCloseNewTransactionModal() {
    setIsTransactionModalOpen(false);
  }
  return (
    /**
     * Aqui estamos usando o TransactionsContent para passar o valor
     * obtido no arquivo TransactionsContext, neste arquivo iremos obter os dados do nosso backEnd
     * e utilizando o conceito de context iremos repassar os valores para todos nosso componentes
     * da aplicação
     */
    <TransactionsProvider>
      <Header onOpenNewTransactionModal={handleOpenNewTransactionModal} />
      <Dashboard />
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onRequestClose={handleCloseNewTransactionModal}
      />
      <GlobalStyle />
    </TransactionsProvider>
  );
}
