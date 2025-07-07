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
      { id: 8, name: 'Không yêu cầu ngoại ngữ' },
      { id: 1, name: 'Tiếng Việt' },
      { id: 2, name: 'Tiếng Anh (English)' },
      { id: 3, name: 'Tiếng Trung (Chinese)' },
      { id: 4, name: 'Tiếng Nhật (Japanese)' },
      { id: 5, name: 'Tiếng Hàn (Korean)' },
      { id: 6, name: 'Tiếng Pháp (French)' },
      { id: 7, name: 'Tiếng Đức (German)' },
    ];
    await this.languageRepository.save(defaultLanguages);
  }

  async findAll() {
    return this.languageRepository.find();
  }
}
