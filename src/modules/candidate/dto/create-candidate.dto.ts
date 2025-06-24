import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  googleId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  gender: string;

  @IsOptional()
  @IsMobilePhone('vi-VN')
  phone: string;

  @IsOptional()
  birthday: Date;

  @IsOptional()
  location: string;

  @IsOptional()
  avatar?: string;
}
export class LoginUserDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class AdminFilterCandidateDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
