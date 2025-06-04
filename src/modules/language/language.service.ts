import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async createDefaultLanguages() {
    const defaultLanguages = [
      { name: 'Tiếng Việt', id: 1 },
      { name: 'Tiếng Anh', id: 2 },
      { name: 'Tiếng Trung', id: 3 },
      { name: 'Tiếng Nhật', id: 4 },
      { name: 'Tiếng Hàn', id: 5 },
    ];
    await this.languageRepository.save(defaultLanguages);
  }

  async findAll() {
    return this.languageRepository.find();
  }
}
