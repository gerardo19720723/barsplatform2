// Roles del sistema
export enum Role {
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export interface User {
  id: string;
  email: string;
  role: Role;
  tenantId?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
}