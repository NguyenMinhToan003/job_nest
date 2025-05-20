import { SetMetadata } from '@nestjs/common';

export const ROLE_LIST = {
  ADMIN: 'ADMIN',
  COMPANY: 'DOANH_NGHIEP',
  USER: 'USER',
};
// daxem, daxem, tuchoi, chapnhap, huy
export enum APPLY_JOB_STATUS {
  APPLY = 'UNG_TUYEN',
  ACCEPT = 'THANH_CONG',
  REJECT = 'TU_CHOI',
  CANCEL = 'HUY',
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
