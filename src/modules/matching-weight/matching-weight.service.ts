import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchingWeight } from './entities/matching-weight.entity';
import { Repository } from 'typeorm';
import { CreateMatchingWeightDto } from './dto/create-matching-weight.dto';
import { UpdateMatchingWeightDto } from './dto/update-matching-weight.dto';

@Injectable()
export class MatchingWeightService {
  constructor(
    @InjectRepository(MatchingWeight)
    private readonly matchingWeightRepository: Repository<MatchingWeight>,
  ) {}

  async triggerJobCreate(jobId: number, dto: CreateMatchingWeightDto) {
    return this.matchingWeightRepository.save({
      job: { id: jobId },
      locationWeight: dto.locationWeight,
      skillWeight: dto.skillWeight,
      majorWeight: dto.majorWeight,
      languageWeight: dto.languageWeight,
      educationWeight: dto.educationWeight,
      levelWeight: dto.levelWeight,
    });
  }

  async getMatchingWeightByJobId(jobId: number) {
    return this.matchingWeightRepository.findOne({
      where: { job: { id: jobId } },
    });
  }
  async updateMatchingWeight(jobId: number, dto: UpdateMatchingWeightDto) {
    const existingWeight = await this.getMatchingWeightByJobId(jobId);
    if (!existingWeight) {
      throw new Error('Matching weight not found for the given job ID');
    }
    return this.matchingWeightRepository.save({
      ...existingWeight,
      ...dto,
    });
  }
}
