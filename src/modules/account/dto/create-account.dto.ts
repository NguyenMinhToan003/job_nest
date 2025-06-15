import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  role: string;
}
export class LoginDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
