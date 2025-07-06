import { Type } from 'class-transformer';
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

export class FilterNotiAccountDto {
  @IsOptional()
  @IsEnum(NOTI_TYPE)
  type?: NOTI_TYPE;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  limit?: number;
}
