import { IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  amount: number;
  @IsNotEmpty()
  transactionType: string;
  @IsNotEmpty()
  employerId: number;
}
