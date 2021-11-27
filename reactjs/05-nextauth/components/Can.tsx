/**
 * Este componente será utilizado para permitir ou não a visualização de outro componente
 * Para isto este componente recebe um children que será repassado para o return
 * caso o teste com o hook useCan seja devidamente validado
 */
import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CanProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}
export function Can({ children, permissions, roles }: CanProps) {
  const userCanSeeComponent = useCan({ permissions, roles });

  if (!userCanSeeComponent) {
    return null;
  }
  return <>{children}</>;
}
