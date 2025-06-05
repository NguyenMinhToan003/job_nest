import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchingKey } from './entities/matching-key.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MatchingKeyService {
  constructor(
    @InjectRepository(MatchingKey)
    private readonly matchingKeyRepository: Repository<MatchingKey>,
  ) {}

  async createDefaultKeys() {
    const defaultKeys = [
      { displayName: 'Kỹ năng chuyên môn', fieldName: 'skill', id: 1 },
      { displayName: 'Kinh nghiệm làm việc', fieldName: 'experience', id: 2 },
      { displayName: 'Trình độ học vấn', fieldName: 'education', id: 3 },
      { displayName: 'Ngôn ngữ', fieldName: 'language', id: 4 },
      { displayName: 'Địa điểm làm việc', fieldName: 'location', id: 5 },
    ];

    await this.matchingKeyRepository.save(defaultKeys);
  }
  async getAllKeys() {
    return this.matchingKeyRepository.find();
  }
}
