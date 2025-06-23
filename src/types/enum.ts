// dang xu ly, dang phong van, phu hop , khong phu hop
export enum APPLY_JOB_STATUS {
  PROCESSING = 'DANG_XU_LY',
  INTERVIEWING = 'DANG_PHONG_VAN',
  QUALIFIED = 'PHU_HOP',
  UNQUALIFIED = 'KHONG_PHU_HOP',
  HIRED = 'DA_TUYEN',
}

export enum ROLE_LIST {
  ADMIN = 'QUAN_TRI',
  EMPLOYER = 'NHA_TUYEN_DUNG',
  CANDIDATE = 'UNG_VIEN',
}

export enum INTERVIEW_STATUS {
  PENDING = 'DANG_XU_LY',
  CONFIRMED = 'CHAP_NHAN',
  COMPLETED = 'HOAN_THANH',
  CANCELLED = 'HUY',
}

export enum PROVIDER_LIST {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
}

export enum JOB_STATUS {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  CREATE = 'CREATE',
}

export enum NOTI_TYPE {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DEFAULT = 'DEFAULT',
}

export enum PackageType {
  JOB = 'JOB',
  RESUME = 'RESUME',
  BANNER = 'BANNER',
}

export enum PAYMENT_STATUS {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}
