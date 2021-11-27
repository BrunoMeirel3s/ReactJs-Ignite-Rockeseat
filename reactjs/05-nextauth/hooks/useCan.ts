import { AuthContext } from "./../contexts/AuthContext";
import { useContext } from "react";
import { validateUserPermissions } from "../utils/validateUserPermissions";
type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

/**
 * Componente utilizado para validar se o usuário possui
 * as permissões necessárias para visualização das informações
 * ou possui as roles necessárias
 */
export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
}
