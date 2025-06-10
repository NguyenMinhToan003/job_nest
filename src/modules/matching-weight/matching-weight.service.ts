import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchingWeight } from './entities/matching-weight.entity';
import { Repository } from 'typeorm';
import { CreateMatchingWeightDto } from './dto/create-matching-weight.dto';

@Injectable()
export class MatchingWeightService {
  constructor(
    @InjectRepository(MatchingWeight)
    private readonly matchingWeightRepository: Repository<MatchingWeight>,
  ) {}

  async triggerJobCreate(jobId: number, dto: CreateMatchingWeightDto) {
    console.log(dto);
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
}
