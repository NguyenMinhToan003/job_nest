import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagResume } from './entities/tag-resume.entity';
import { CreateTagResumeDto } from './dto/create-tag-resume.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagResumeService {
  constructor(
    @InjectRepository(TagResume)
    private readonly tagResumeRepository: Repository<TagResume>,
  ) {}
  async createTagResume(employerId: number, dto: CreateTagResumeDto) {
    return this.tagResumeRepository.save({
      color: dto.color,
      name: dto.name,
      employer: { id: employerId },
    });
  }
  async getAllTagResume(employerId: number) {
    return this.tagResumeRepository.find({
      where: { employer: { id: employerId } },
      relations: {
        applyJobs: true,
      },
    });
  }

  async deleteTagResume(employerId: number, id: number) {
    const tagResume = await this.tagResumeRepository.findOne({
      where: { id, employer: { id: employerId } },
    });
    if (!tagResume) {
      throw new Error('Tag not found or does not belong to this employer');
    }
    return this.tagResumeRepository.remove(tagResume);
  }

  async updateTagResume(
    employerId: number,
    id: number,
    dto: CreateTagResumeDto,
  ) {
    const tagResume = await this.tagResumeRepository.findOne({
      where: { id, employer: { id: employerId } },
    });
    if (!tagResume) {
      throw new Error('Tag not found or does not belong to this employer');
    }
    tagResume.name = dto.name || tagResume.name;
    tagResume.color = dto.color || tagResume.color;
    return this.tagResumeRepository.save(tagResume);
  }
}
