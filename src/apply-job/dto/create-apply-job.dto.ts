import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Cv } from 'src/cv/entities/cv.entity';
import { Job } from 'src/job/entities/job.entity';
import { APPLY_JOB_STATUS } from 'src/types/enum';
import { User } from 'src/users/entities/user.entity';

export class CreateApplyJobDto {
  @IsOptional()
  note: string;

  @IsNotEmpty()
  cv: Cv;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  phone: string;
}
export class ApplyJobDto {
  job: Job;
  user: User;
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
