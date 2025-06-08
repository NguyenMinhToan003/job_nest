import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateResumeversionExpDto {
  @IsNotEmpty()
  companyName: string;
  @IsNotEmpty()
  position: string;
  @IsNotEmpty()
  startTime: Date;
  @IsOptional()
  endTime: Date | null;
  @IsNotEmpty()
  jobDescription: string;
  @IsNotEmpty()
  resumeVersionId: number;
  @IsOptional()
  typeJobId?: number;
}
