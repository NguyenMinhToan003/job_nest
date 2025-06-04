import { Controller } from '@nestjs/common';
import { LanguageJobService } from './language-job.service';

@Controller('language-job')
export class LanguageJobController {
  constructor(private readonly languageJobService: LanguageJobService) {}
}
