import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { APPLY_JOB_STATUS } from 'src/types/enum';

export class CreateApplyJobDto {
  @IsOptional()
  candidateNote: string;

  @IsNotEmpty()
  @IsMobilePhone('vi-VN')
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  resumeId: number;
}
export class ApplyJobWithNewCvDto {
  @IsOptional()
  candidateNote: string;

  @IsOptional()
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'CV không hợp lệ' },
  )
  cvId: number;
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;
}
export class GetApplyByStatusDto {
  @IsEnum(APPLY_JOB_STATUS)
  @IsNotEmpty()
  status: APPLY_JOB_STATUS;
}
export class GetApplyJobByJobIdDto {
  @IsOptional()
  jobId?: number;
  @IsOptional()
  @IsEnum(APPLY_JOB_STATUS)
  status?: APPLY_JOB_STATUS;
}

export class FilterApplyJobDto {
  @IsOptional()
  jobId?: number;

  @IsOptional()
  status?: APPLY_JOB_STATUS;
}
export class UpdateApplyJobStatusDto {
  @IsEnum(APPLY_JOB_STATUS)
  @IsNotEmpty()
  status: APPLY_JOB_STATUS;
}

export class AddTagResumeDto {
  @IsNotEmpty()
  @IsArray()
  tagIds: number[];
}
export class SendMailToCandidateDto {
  subject: string;
  content: string;
}
export class GetApplyByTagResumeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  jobId: number;

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @IsInt({ each: true })
  tagIds: number[];

  @IsOptional()
  @Type(() => IsEnum([APPLY_JOB_STATUS]))
  @IsEnum(APPLY_JOB_STATUS)
  status?: APPLY_JOB_STATUS;
}
