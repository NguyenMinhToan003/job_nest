import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchingWeight } from './entities/matching-weight.entity';
import { Repository } from 'typeorm';
import { MatchingKeyService } from '../matching-key/matching-key.service';

@Injectable()
export class MatchingWeightService {
  constructor(
    @InjectRepository(MatchingWeight)
    private readonly matchingWeightRepository: Repository<MatchingWeight>,
    private readonly matchingKeyService: MatchingKeyService,
  ) {}

  async triggerJobCreate(jobId: number) {
    const existingWeights = await this.matchingWeightRepository.find({
      where: { job: { id: jobId } },
      relations: ['matchingKey'],
    });
    if (existingWeights.length > 0) {
      return existingWeights;
    }

    // Đảm bảo các MatchingKey đã được tạo
    await this.matchingKeyService.createDefaultKeys();
    const matchingKeys = await this.matchingKeyService.getAllKeys();

    // Tạo defaultWeights với MatchingKey đầy đủ (bao gồm id)
    const defaultWeights = [
      { fieldName: 'skill', weight: 0.4 },
      { fieldName: 'experience', weight: 0.25 },
      { fieldName: 'education', weight: 0.15 },
      { fieldName: 'language', weight: 0.1 },
      { fieldName: 'location', weight: 0.1 },
    ].map((weightData) => {
      const matchingKey = matchingKeys.find(
        (key) => key.fieldName === weightData.fieldName,
      );
      if (!matchingKey) {
        throw new Error(
          `MatchingKey with fieldName ${weightData.fieldName} not found`,
        );
      }
      return {
        job: { id: jobId },
        matchingKey: { id: matchingKey.id },
        weight: weightData.weight,
      };
    });

    return this.matchingWeightRepository.save(defaultWeights);
  }
}
