import { SetMetadata } from '@nestjs/common';

export const ROLE_LIST = {
  ADMIN: 'ADMIN',
  COMPANY: 'DOANH_NGHIEP',
  USER: 'USER',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
