import { Controller } from '@nestjs/common';
import { LanguageResumeService } from './language-resume.service';

@Controller('language-resume')
export class LanguageResumeController {
  constructor(private readonly languageResumeService: LanguageResumeService) {}
}
