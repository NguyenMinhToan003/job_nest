import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PROVIDER_LIST } from 'src/types/enum';

export class CreateAuthTokenDto {
  @IsNotEmpty()
  @IsInt()
  accountId: number;

  @IsOptional()
  @IsEnum(PROVIDER_LIST)
  provider?: string;

  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  tokenExpiry?: Date;
}
