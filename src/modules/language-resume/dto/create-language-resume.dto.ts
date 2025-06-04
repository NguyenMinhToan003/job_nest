import { IsNotEmpty } from 'class-validator';

export class CreateLanguageResumeDto {
  @IsNotEmpty()
  languageId: number;
  @IsNotEmpty()
  resumeVersionId: number;
  @IsNotEmpty()
  level: number;
}
