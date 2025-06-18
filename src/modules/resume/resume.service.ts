import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resume } from './entities/resume.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResumeService {
  constructor(
    @InjectRepository(Resume)
    private readonly resumeRepository: Repository<Resume>,
  ) {}
  async create(candidateId: number, name?: string) {
    const existingResumes = await this.resumeRepository.find({
      where: { candidate: { id: candidateId } },
    });
    return this.resumeRepository.save({
      candidate: { id: candidateId },
      name: name ? name : 'Hồ sơ ' + candidateId,
      isDefault: existingResumes.length === 0,
    });
  }
  async getAll(candidateId: number) {
    return this.resumeRepository.find({
      relations: {
        resumeVersions: true,
      },
      where: {
        candidate: { id: +candidateId },
      },
    });
  }
  async validateMe(candidateId: number, resumeId: number) {
    return this.resumeRepository.findOne({
      where: {
        id: +resumeId,
        candidate: { id: +candidateId },
      },
    });
  }
  async update(candidateId: number, resumeId: number, name: string) {
    const resume = await this.validateMe(candidateId, resumeId);
    if (!resume) {
      throw new Error('Hồ sơ không tồn tại hoặc bạn không có quyền truy cập');
    }
    return this.resumeRepository.save({
      ...resume,
      name,
    });
  }

  async delete(candidateId: number, resumeId: number) {
    const resume = await this.validateMe(candidateId, resumeId);
    if (!resume) {
      throw new Error('Hồ sơ không tồn tại hoặc bạn không có quyền truy cập');
    }
    if (resume.isDefault) {
      throw new BadRequestException('Không thể xóa hồ sơ mặc định.');
    }
    return this.resumeRepository.remove(resume);
  }

  async toggleDefault(candidateId: number, resumeId: number) {
    const resume = await this.validateMe(candidateId, resumeId);
    if (!resume) {
      throw new UnauthorizedException(
        'Hồ sơ không tồn tại hoặc bạn không có quyền truy cập',
      );
    }
    const listResumes = await this.resumeRepository.find({
      where: {
        candidate: { id: +candidateId },
      },
    });
    if (listResumes.length === 0) {
      throw new BadRequestException(
        'Bạn không có hồ sơ nào để đặt làm mặc định',
      );
    }
    if (listResumes.length === 1 && listResumes[0].isDefault) {
      listResumes[0].isDefault = true;
      throw new BadRequestException('Bắt buộc có ít nhất một hồ sơ mặc định');
    }
    listResumes.map((item) => {
      item.isDefault = false;
      item.isDefault = item.id === resumeId;
      return item;
    });
    await this.resumeRepository.save(listResumes);
  }
}
