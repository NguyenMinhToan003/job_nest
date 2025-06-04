import { IsEnum, IsNotEmpty } from 'class-validator';

export class CreateLanguageJobDto {
  @IsNotEmpty()
  jobId: number;
  @IsNotEmpty()
  languageId: number;
  @IsEnum([1, 2, 3])
  @IsNotEmpty()
  level: number;
}
