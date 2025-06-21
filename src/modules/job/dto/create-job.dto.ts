import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { JOB_STATUS } from 'src/types/enum';
export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  expiredAt: Date;

  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsString({ each: true })
  benefits: string[];

  @IsOptional()
  skills: number[];

  @IsNotEmpty()
  @ArrayMinSize(1)
  locations: number[];

  @IsNotEmpty()
  @IsInt()
  experience: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  levels: number[];

  @IsNotEmpty()
  @ArrayMinSize(1)
  types: number[];

  @IsNotEmpty()
  requirement: string;

  @ValidateIf((o) => o.minSalary !== null)
  @Min(0)
  minSalary: number | null;

  @ValidateIf((o) => o.maxSalary !== null)
  @Min(0)
  maxSalary: number | null;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  education?: number;

  @IsOptional()
  @IsArray()
  languages?: { languageId: number; level: number }[];

  @IsNotEmpty()
  fieldId: number;
}

export class JobFilterDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  fieldId?: number;

  @IsOptional()
  levels?: number[];

  @IsOptional()
  experience?: string[];

  @IsOptional()
  typeJobs?: number[];

  @IsOptional()
  minSalary?: number;

  @IsOptional()
  maxSalary?: number;

  @IsOptional()
  @IsString({ each: true })
  citys?: string[];

  @IsOptional()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  skills?: number[];

  @IsOptional()
  employerIds: number[];

  @IsOptional()
  limit?: number;

  @IsOptional()
  page?: number;
}
export class AdminJobFilterDto {
  @IsOptional()
  @IsEnum(JOB_STATUS)
  isActive?: number;

  @IsOptional()
  isExpired?: number;

  @IsOptional()
  fieldId?: number;

  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsString({ each: true })
  levels?: string[];

  @IsOptional()
  experience?: string[];

  @IsOptional()
  typeJobs?: number[];

  @IsOptional()
  minSalary?: number;

  @IsOptional()
  maxSalary?: number;

  @IsOptional()
  @IsString({ each: true })
  citys?: string[];

  @IsOptional()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  skills?: number[];

  @IsOptional()
  @IsInt()
  employerId: number;
}
export class CompanyFilterJobDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  levels?: string[];

  @IsOptional()
  @IsInt()
  experience?: number;

  @IsOptional()
  @IsInt()
  typeJobs?: number[];

  @IsOptional()
  minSalary?: number;

  @IsOptional()
  maxSalary?: number;

  @IsOptional()
  locations?: number[];

  @IsOptional()
  benefits?: string[];

  @IsOptional()
  skills?: string[];

  @IsOptional()
  @IsInt()
  isActive?: number;

  @IsOptional()
  @IsInt()
  isShow?: number;

  @IsOptional()
  isExpired?: number;
}

export class MapDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsOptional()
  @IsInt()
  radius?: number; // in meters, default is 5000m
}
