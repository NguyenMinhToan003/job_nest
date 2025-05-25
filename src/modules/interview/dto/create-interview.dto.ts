import {
  ArrayMinSize,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { INTERVIEW_STATUS } from 'src/types/enum';

export class CreateInterviewDto {
  @IsNotEmpty()
  interviewTime: Date;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsOptional()
  @IsEnum(INTERVIEW_STATUS)
  status?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  candidates: number[];

  googleCalendarEventId?: string;

  meetingLink?: string;

  calendarId?: string;

  @IsNotEmpty()
  @IsInt()
  employerId: number;

  @IsNotEmpty()
  @IsInt()
  applyJobs: number;
}
