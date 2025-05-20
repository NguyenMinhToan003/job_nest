import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateApplyJobDto {
  @IsNotEmpty()
  cvId: number;
  @IsOptional()
  note: string;
}
export class ApplyJobDto {
  jobId: number;
  userId: number;
}
