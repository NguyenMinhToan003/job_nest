import {
  IsArray,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateResumeDto {
  @IsString()
  @MaxLength(255)
  resumeName: string;

  @IsString()
  @IsOptional()
  resumeImage?: string;

  @IsString()
  @MaxLength(100)
  userName: string;

  @IsDateString()
  dateOfBirth: Date;

  @IsString()
  @IsPhoneNumber('VI')
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  career: string;

  @IsNumber()
  @Min(0)
  expectedSalaryMin: number | null;

  @IsNumber()
  @Min(0)
  expectedSalaryMax: number | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skillIds?: string[];

  @IsOptional()
  @IsString()
  experienceId?: string;

  @IsOptional()
  @IsString()
  levelId?: string;

  @IsOptional()
  @IsString()
  desiredLevelId?: string;

  @IsOptional()
  @IsString()
  typeJobId?: string;

  @IsOptional()
  @IsString()
  districtId?: string;

  @IsNotEmpty()
  @IsNumber()
  cvId?: number;
}
