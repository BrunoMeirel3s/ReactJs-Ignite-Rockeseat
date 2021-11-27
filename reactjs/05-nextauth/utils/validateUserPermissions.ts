/**
 * Criado para realizar a checagem das roles e permissions do usuário
 * comparando as que o usuário possui com as que foram passadadas para a função de validação
 */

type User = {
  permissions: string[];
  roles: string[];
};
type ValidateUserPermissionsParams = {
  user: User;
  permissions?: string[];
  roles?: string[];
};
export function validateUserPermissions({
  user,
  permissions,
  roles,
}: ValidateUserPermissionsParams) {
  if (permissions?.length > 0) {
    const hasAllPermissions = permissions.every((permission) => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles?.length > 0) {
    const hasAllRoles = roles.some((role) => {
      return user.permissions.includes(role);
    });

    if (!hasAllRoles) {
      return false;
    }
  }

  return true;
}
