import { IsNotEmpty } from 'class-validator';

export class CreatePackageDto {}

export class UseSubscriptionDto {
  @IsNotEmpty()
  packageId: string;
  @IsNotEmpty()
  jobId: number;
}
