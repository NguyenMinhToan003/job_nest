import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PackageType } from 'src/types/enum';

export class CreatePackageDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  features: string;

  @IsNotEmpty()
  price: number;

  @IsOptional()
  image?: Express.Multer.File;

  @IsNotEmpty()
  dayValue: number;

  @IsNotEmpty()
  @IsEnum(PackageType)
  type: PackageType;
}

export class UseSubscriptionDto {
  @IsNotEmpty()
  packageId: string;
  @IsNotEmpty()
  jobId: number;
}
