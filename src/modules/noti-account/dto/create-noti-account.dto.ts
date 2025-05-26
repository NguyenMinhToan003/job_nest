import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { NOTI_TYPE } from 'src/types/enum';

export class CreateNotiAccountDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  link?: string;

  @IsOptional()
  @IsEnum(NOTI_TYPE)
  type?: string;

  @IsNotEmpty()
  @IsInt()
  receiverAccountId: number;
}
