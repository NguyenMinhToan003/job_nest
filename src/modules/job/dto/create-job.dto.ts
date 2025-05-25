import {
  ArrayMinSize,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
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
  @IsString({ each: true })
  @ArrayMinSize(1)
  levels: string[];

  @IsNotEmpty()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  types: number[];

  @IsNotEmpty()
  requirement: string;

  @IsNotEmpty()
  @IsNumber()
  minSalary: number;

  @IsNotEmpty()
  @IsNumber()
  maxSalary: number;

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
