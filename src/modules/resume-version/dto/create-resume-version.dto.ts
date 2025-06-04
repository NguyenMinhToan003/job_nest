import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateResumeVersionDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  phone: string;
  @IsNotEmpty()
  gender: string;
  @IsNotEmpty()
  location: string;
  @IsNotEmpty()
  dateOfBirth: Date;
  @IsNotEmpty()
  about: string;
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
}
