import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
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
export class FilterPacageDto {
  @IsOptional()
  @IsArray()
  @IsEnum(PackageType, { each: true })
  type: PackageType[];

  @IsOptional()
  mini?: boolean;
}

export class AdminFilterPackage {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(PackageType, { each: true })
  type?: PackageType[];
}
