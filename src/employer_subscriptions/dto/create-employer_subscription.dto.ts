import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateEmployerSubscriptionDto {
  @IsNotEmpty()
  packageId: string;
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  note?: string;
}
export class UseSubscriptionDto {
  @IsNotEmpty()
  jobId: number;
  @IsNotEmpty()
  packageId: string;
}
export class UseSubBannerDto {
  @IsNotEmpty()
  employerSubId: number;
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
