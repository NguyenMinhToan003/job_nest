import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
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
  taxCode: string;
  @IsNotEmpty()
  employeeScale: string;
  @IsNotEmpty()
  businessType: string;

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
