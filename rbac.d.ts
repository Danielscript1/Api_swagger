declare module 'rbac' {
  export interface RBACOptions {
    roles: string[];
    permissions: {
      [resource: string]: string[];
    };
    grants: {
      [role: string]: string[];
    };
  }

  export interface RBACInstance {
    init(): Promise<void>;
    can(role: string, action: string, resource: string): Promise<boolean>;
    addRole(role: string, parent?: string): Promise<void>;
    removeRole(role: string): Promise<void>;
    addPermission(resource: string, action: string): Promise<void>;
    removePermission(resource: string, action: string): Promise<void>;
    grant(role: string, resource: string, action: string): Promise<void>;
    revoke(role: string, resource: string, action: string): Promise<void>;
  }

  export class RBAC implements RBACInstance {
    constructor(options: RBACOptions);
    init(): Promise<void>;
    can(role: string, action: string, resource: string): Promise<boolean>;
    addRole(role: string, parent?: string): Promise<void>;
    removeRole(role: string): Promise<void>;
    addPermission(resource: string, action: string): Promise<void>;
    removePermission(resource: string, action: string): Promise<void>;
    grant(role: string, resource: string, action: string): Promise<void>;
    revoke(role: string, resource: string, action: string): Promise<void>;
  }
}

