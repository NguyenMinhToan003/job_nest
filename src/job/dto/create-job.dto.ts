import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Benefit } from 'src/benefit/entities/benefit.entity';
import { Experience } from 'src/experience/entities/experience.entity';
import { Level } from 'src/level/entities/level.entity';
import { Location } from 'src/location/entities/location.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import { TypeJob } from 'src/type-job/entities/type-job.entity';

export class CreateJobDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  benefits: Benefit[];

  @IsNotEmpty()
  skills: Skill[];

  @IsNotEmpty()
  locations: Location[];

  @IsNotEmpty()
  experience: Experience;

  @IsNotEmpty()
  levels: Level[];

  @IsNotEmpty()
  types: TypeJob[];

  @IsNotEmpty()
  requirement: string;

  @IsNotEmpty()
  minSalary: number;

  @IsNotEmpty()
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
  levels?: Level[];

  @IsOptional()
  experience?: string;

  @IsOptional()
  @IsInt()
  typeJobs?: number;

  @IsOptional()
  @IsNumber()
  minSalary?: number;

  @IsOptional()
  @IsNumber()
  maxSalary?: number;

  @IsOptional()
  @IsString()
  citys?: string;

  @IsOptional()
  benefits?: string;

  @IsOptional()
  skills?: string;
}
