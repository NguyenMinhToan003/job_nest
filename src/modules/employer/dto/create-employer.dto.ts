import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  logo?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  role?: string;

  @IsOptional()
  introduction?: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(13)
  taxCode: string;

  @IsNotEmpty()
  employeeScaleId: number;

  @IsNotEmpty()
  businessTypeId: number;

  @IsNotEmpty()
  countryId: number;

  @IsNotEmpty()
  @IsMobilePhone('vi-VN')
  phone: string;

  @IsOptional()
  website?: string;
}
export class LoginCompanyDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class AdminFilterCompanyDto {
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

export class FilterEmployerDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
  @IsOptional()
  employeeScaleId?: number;
  @IsOptional()
  businessTypeId?: number;
  @IsOptional()
  countryId?: number;
}
