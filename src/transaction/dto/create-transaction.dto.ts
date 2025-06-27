import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateEmployerSubscriptionDto } from 'src/employer_subscriptions/dto/create-employer_subscription.dto';
import { PAYMENT_STATUS } from 'src/types/enum';

export class CreateTransactionDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployerSubscriptionDto)
  subscriptions: CreateEmployerSubscriptionDto[];

  @IsNotEmpty()
  transactionType: string;

  @IsOptional()
  employerId: number;
}
export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(PAYMENT_STATUS)
  status?: PAYMENT_STATUS;

  @IsOptional()
  vnp_TxnRef?: string;

  @IsOptional()
  recordedAt?: Date;
}
