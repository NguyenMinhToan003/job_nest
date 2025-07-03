import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { EMPLOYER_SUBSCRIPTION_STATUS } from 'src/types/enum';

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
  @IsOptional()
  status: EMPLOYER_SUBSCRIPTION_STATUS;
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
