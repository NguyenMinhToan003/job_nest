import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  logo: string;

  @IsOptional()
  googleId: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  role: string;
}
export class LoginCompanyDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
