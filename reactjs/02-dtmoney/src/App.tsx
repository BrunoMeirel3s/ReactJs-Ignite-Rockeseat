import React from "react";
import Modal from "react-modal";
import { useState } from "react";
import { GlobalStyle } from "./styles/global";
import { Header } from "./components/Header";
import { Dashboard } from "./components/dashboard";
import { NewTransactionModal } from "./components/newTransactionModal";

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
    <>
      <Header onOpenNewTransactionModal={handleOpenNewTransactionModal} />
      <Dashboard />
      <NewTransactionModal
        isOpen={isNewTransactionModalOpen}
        onRequestClose={handleCloseNewTransactionModal}
      />
      <GlobalStyle />
    </>
  );
}
