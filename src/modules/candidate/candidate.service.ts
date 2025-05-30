import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { UpdateUserDto } from './dto/update-candidate.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepo: Repository<Candidate>,
    private uploadService: UploadService,
  ) {}

  async create(accountId, dto) {
    return this.candidateRepo.save({
      id: accountId,
      name: dto.name,
      avatar: dto.avatar,
      phone: dto.phone,
      gender: dto.gender,
    });
  }

  async getMe(userId: number) {
    const candidate = await this.candidateRepo.findOne({
      where: { id: userId },
      relations: {
        account: true,
        notiSettings: true,
        skills: true,
        saveJobs: true,
        cv: true,
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
    console.log('avatar', avatar);
    if (avatar) {
      const uploadAvatar = await this.uploadService.uploadFile([avatar]);
      console.log('uploadAvatar', uploadAvatar);
      if (uploadAvatar && uploadAvatar.length > 0) {
        candidate.avatar = uploadAvatar[0].secure_url;
      }
    }
    console.log('candidate', candidate);
    return this.candidateRepo.save(candidate);
  }
}
