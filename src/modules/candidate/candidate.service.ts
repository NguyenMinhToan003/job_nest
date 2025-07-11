import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { UpdateUserDto } from './dto/update-candidate.dto';
import { UploadService } from 'src/upload/upload.service';
import {
  AdminFilterCandidateDto,
  CreateUserDto,
} from './dto/create-candidate.dto';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
    private uploadService: UploadService,
  ) {}

  async create(accountId, dto: CreateUserDto) {
    console.log('create candidate', accountId, dto);
    return this.candidateRepo.save({
      id: accountId,
      name: dto.name,
      avatar: dto.avatar,
      birthday: dto.birthday,
      location: dto.location,
      phone: dto.phone,
      gender: dto.gender,
    });
  }

  async findAllSendMailCronjob() {
    return this.candidateRepo.find({
      relations: {
        account: true,
      },
    });
  }

  async getMe(userId: number) {
    const candidate = await this.candidateRepo.findOne({
      where: { id: userId },
      relations: {
        account: true,
        saveJobs: true,
      },
    });
    delete candidate.account.password;
    delete candidate.account.googleId;
    return candidate;
  }
  async updateMe(
    userId: number,
    dto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ) {
    const candidate = await this.candidateRepo.findOne({
      where: { id: userId },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }
    if (dto.name !== undefined) {
      candidate.name = dto.name;
    }
    if (dto.avatar !== undefined) {
      candidate.avatar = dto.avatar;
    }
    if (dto.phone !== undefined) {
      candidate.phone = dto.phone;
    }
    if (avatar) {
      const uploadAvatar = await this.uploadService.uploadFile([avatar]);
      if (uploadAvatar && uploadAvatar.length > 0) {
        candidate.avatar = uploadAvatar[0].secure_url;
      }
    }
    return this.candidateRepo.save(candidate);
  }
  async getAllCandidates(query: AdminFilterCandidateDto) {
    const where: any = {};
    if (query.search) {
      where.name = query.search;
    }
    const [items, total] = await this.candidateRepo.findAndCount({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      order: {
        [query.sortBy || 'createdAt']: query.sortOrder || 'desc',
      },
      relations: {
        account: true,
      },
    });
    const totalPage = Math.ceil(total / query.limit);
    return {
      items,
      total,
      totalPage,
    };
  }
}
