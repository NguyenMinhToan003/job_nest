import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateResumeVersionDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEnum(['NAM', 'NU'])
  gender: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  @IsArray()
  languageResumes: { languageId: number }[];

  @IsNotEmpty()
  @IsArray()
  skills: number[];

  @IsNotEmpty()
  education: number;

  @IsNotEmpty()
  level: number;

  @IsOptional()
  about?: string;

  @IsNotEmpty()
  experience: number;

  @IsNotEmpty()
  district: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  majors: number[];

  @IsOptional()
  avatar?: string;

  @IsOptional()
  publicIdPdf?: string;

  @IsOptional()
  urlPdf?: string;

  @IsOptional()
  expectedSalary?: number;

  @IsNotEmpty()
  typeJobId?: number;
}

export class QueryDto {
  search?: string;
  page?: number;
  limit?: number;
  skills?: number[];
  levels?: string[];
}
