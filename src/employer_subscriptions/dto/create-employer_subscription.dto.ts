import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class CreateEmployerSubscriptionDto {
  @IsNotEmpty()
  packageId: string;
  @IsNotEmpty()
  quantity: number;
}
export class UseSubscriptionDto {
  @IsNotEmpty()
  jobId: number;
  @IsNotEmpty()
  packageId: string;
}

export class CreateEmployerSubscriptionDtoWrapper {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployerSubscriptionDto)
  subscriptions: CreateEmployerSubscriptionDto[];

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
