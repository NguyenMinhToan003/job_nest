import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeVersion } from './entities/resume-version.entity';
import { Repository } from 'typeorm';
import { CreateResumeVersionDto } from './dto/create-resume-version.dto';
import { UploadService } from 'src/upload/upload.service';
import { ResumeService } from '../resume/resume.service';
import { LanguageResumeService } from '../language-resume/language-resume.service';

@Injectable()
export class ResumeVersionService {
  constructor(
    @InjectRepository(ResumeVersion)
    private readonly resumeVersionRepository: Repository<ResumeVersion>,
    private readonly uploadService: UploadService,
    private readonly resumeService: ResumeService,
    private readonly languageResumeService: LanguageResumeService,
  ) {}

  async create(
    dto: CreateResumeVersionDto,
    avatar: Express.Multer.File,
    resumeId: number,
  ) {
    const uploadImage = await this.uploadService.uploadFile([avatar]);
    const resumeVersion = await this.resumeVersionRepository.save({
      about: dto.about,
      avatar: uploadImage[0].secure_url,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      education: { id: +dto.education },
      location: dto.location,
      phone: dto.phone,
      district: { id: dto.district },
      resume: { id: +resumeId },
      username: dto.username,
      level: { id: +dto.level },
      skills: dto.skills ? dto.skills.map((id) => ({ id: +id })) : [],
    });
    if (dto?.languageResumes?.length > 0) {
      for (const languageResume of dto.languageResumes) {
        await this.languageResumeService.create({
          languageId: languageResume.languageId,
          level: languageResume.level,
          resumeVersionId: resumeVersion.id,
        });
      }
    }
    return {
      resumeVersion: resumeVersion.id,
      resume: resumeId,
      message: 'Tạo phiên bản Hồ sơ thành công',
      status: HttpStatus.CREATED,
    };
  }

  async getMe(candidateId: number) {
    return this.resumeVersionRepository.find({
      where: {
        resume: {
          candidate: { id: +candidateId },
        },
      },
      relations: {
        level: true,
        district: {
          city: true,
        },
        languageResumes: true,
        education: true,
        skills: true,
      },
    });
  }

  async validateMe(candidateId: number, resumeVersionId: number) {
    return this.resumeVersionRepository.findOne({
      where: {
        resume: { candidate: { id: +candidateId } },
        id: +resumeVersionId,
      },
    });
  }

  async getOne(candidateId: number, resumeId: number) {
    return this.resumeVersionRepository.findOne({
      where: {
        resume: {
          id: +resumeId,
          candidate: { id: +candidateId },
        },
      },
      relations: {
        level: true,
        district: {
          city: true,
        },
        languageResumes: true,
        education: true,
        skills: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async update(
    candidateId: number,
    dto: CreateResumeVersionDto,
    avatar: Express.Multer.File,
    resumeId: number,
  ) {
    const resume = await this.resumeService.validateMe(candidateId, resumeId);
    if (!resume) {
      throw new BadRequestException('Bạn không có quyền sửa đổi Hồ sơ này');
    }
    this.resumeService.update(candidateId, resumeId, dto.name);
    return await this.create(dto, avatar, resumeId);
  }

  async viewResume(candidateId: number, resumeId: number) {
    console.log('candidateId', candidateId, 'resumeId', resumeId);
    const resume = await this.getOne(candidateId, +resumeId);
    if (!resume) {
      throw new BadRequestException('Hồ sơ không tồn tại');
    }
    return this.resumeVersionRepository.findOne({
      where: {
        resume: {
          candidate: { id: +candidateId },
        },
      },
      relations: {
        level: true,
        district: {
          city: true,
        },
        languageResumes: true,
        education: true,
        skills: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }
}
