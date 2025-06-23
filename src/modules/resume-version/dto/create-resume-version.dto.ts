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
  @IsMobilePhone('vi-VN')
  phone: string;

  @IsNotEmpty()
  @IsEnum(['NAM', 'NU'])
  gender: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsOptional()
  @IsArray()
  languageResumes: { languageId: number; level: number }[];

  @IsNotEmpty()
  @IsArray()
  skills: number[];

  @IsNotEmpty()
  education: number;

  @IsNotEmpty()
  level: number;

  @IsNotEmpty()
  district: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  name: string;

  @IsOptional()
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
