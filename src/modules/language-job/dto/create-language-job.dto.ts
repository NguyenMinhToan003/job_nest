import { IsNotEmpty } from 'class-validator';

export class CreateLanguageJobDto {
  @IsNotEmpty()
  jobId: number;
  @IsNotEmpty()
  languageId: number;
}
