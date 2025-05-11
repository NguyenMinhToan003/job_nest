import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  avatar: string;

  @IsOptional()
  googleId: string;

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
