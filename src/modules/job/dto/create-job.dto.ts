import {
  ArrayMinSize,
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
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsString({ each: true })
  benefits: string[];

  @IsNotEmpty()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  skills: number[];

  @IsNotEmpty()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  locations: number[];

  @IsNotEmpty()
  @IsInt()
  experience: number;

  @IsNotEmpty()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  levels: number[];

  @IsNotEmpty()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  types: number[];

  @IsNotEmpty()
  requirement: string;

  @ValidateIf((o) => o.minSalary !== null)
  @IsNumber()
  @Min(0)
  minSalary: number | null;

  @ValidateIf((o) => o.maxSalary !== null)
  @IsNumber()
  @Min(0)
  maxSalary: number | null;

  @IsNotEmpty()
  description: string;
}

export class JobFilterDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsString({ each: true })
  levels?: string[];

  @IsOptional()
  @IsInt({ each: true })
  experience?: string[];

  @IsOptional()
  @IsInt({ each: true })
  typeJobs?: number[];

  @IsOptional()
  @IsNumber()
  minSalary?: number;

  @IsOptional()
  @IsNumber()
  maxSalary?: number;

  @IsOptional()
  @IsString({ each: true })
  citys?: string[];

  @IsOptional()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsInt({ each: true })
  skills?: number[];

  @IsOptional()
  @IsInt()
  employerId: number;
}
export class AdminJobFilterDto {
  @IsOptional()
  @IsEnum(JOB_STATUS)
  isActive?: number;

  @IsOptional()
  isExpired?: number;

  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  @IsString({ each: true })
  levels?: string[];

  @IsOptional()
  @IsInt({ each: true })
  experience?: string[];

  @IsOptional()
  @IsInt({ each: true })
  typeJobs?: number[];

  @IsOptional()
  @IsNumber()
  minSalary?: number;

  @IsOptional()
  @IsNumber()
  maxSalary?: number;

  @IsOptional()
  @IsString({ each: true })
  citys?: string[];

  @IsOptional()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsInt({ each: true })
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
  @IsNumber()
  minSalary?: number;

  @IsOptional()
  @IsNumber()
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
