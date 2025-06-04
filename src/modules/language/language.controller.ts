import { Controller, Get } from '@nestjs/common';
import { LanguageService } from './language.service';
import { Public } from 'src/decorators/customize';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Public()
  @Get()
  async findAll() {
    return this.languageService.findAll();
  }
}
