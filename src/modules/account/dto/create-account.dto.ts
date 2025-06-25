import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ACCOUNT_STATUS } from 'src/types/enum';

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

export class ChangeStatusDto {
  @IsNotEmpty()
  @IsEnum(ACCOUNT_STATUS)
  status: ACCOUNT_STATUS;

  @IsNotEmpty()
  accountId: number;
}
