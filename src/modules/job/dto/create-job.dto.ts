import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
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

  @Type(() => Number)
  @IsNotEmpty()
  @Min(1)
  @IsInt()
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
  experience: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  levels: number[];

  @IsNotEmpty()
  @ArrayMinSize(1)
  types: number[];

  @IsNotEmpty()
  requirement: string;

  @Type(() => Number)
  @ValidateIf((o) => o.minSalary !== null)
  @Min(0)
  @IsNumber()
  minSalary: number | null;

  @Type(() => Number)
  @ValidateIf((o) => o.maxSalary !== null)
  @Min(0)
  @IsNumber()
  maxSalary: number | null;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  education?: number;

  @IsOptional()
  @IsArray()
  languages?: { languageId: number; level: number }[];

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  majors: number[];
}

export class JobFilterDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  fieldId?: number;

  @IsOptional()
  majorId?: number;

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
  employerId: number;
}
export class CompanyFilterJobDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  levels?: string[];

  @IsOptional()
  experience?: number;

  @IsOptional()
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
  isActive?: number;

  @IsOptional()
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
  radius?: number; // in meters, default is 5000m
}
