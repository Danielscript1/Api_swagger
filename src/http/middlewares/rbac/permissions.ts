import { can } from './secure';


export const userPermissions = {
  create: can('create', 'user'),
  view: can('view', 'user'),
  update: can('update', 'user'),
  delete: can('delete', 'user'),
};

export const passwordPermissions = {
  change: can('change', 'password'),
  forgot: can('forgot', 'password'),
};

export const adminPermissions = {
  deleteUser: can('delete', 'user'),
  updateRBAC: can('update', 'rbac'),
};




