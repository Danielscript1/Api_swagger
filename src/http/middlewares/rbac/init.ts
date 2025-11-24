/// <reference path="../../../../rbac.d.ts" />
import { RBAC } from 'rbac';

const rbac = new RBAC({
  roles: ['superadmin', 'admin', 'user'],
  permissions: {
    user: ['create', 'view', 'delete', 'update'],
    password: ['change', 'forgot'],
    rbac: ['update'],
  },
  grants: {
    user: ['change_password'],
    admin: ['create_user', 'view_user', 'update_user', 'delete_user', 'update_rbac'], 
    superadmin: ['admin'],
  },
});

export async function initRBAC() {
  await rbac.init(); 
}

export { rbac };