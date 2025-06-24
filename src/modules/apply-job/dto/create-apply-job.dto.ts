import {
  IsArray,
  IsEnum,
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
  username: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone: string;

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
  @IsNotEmpty()
  jobId: number;
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
