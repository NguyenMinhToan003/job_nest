import { Injectable } from '@nestjs/common';
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

  async init(
    candidateId: number,
    dto: CreateResumeVersionDto,
    avatar: Express.Multer.File,
  ) {
    const uploadImage = await this.uploadService.uploadFile([avatar]);
    const resume = await this.resumeService.create(candidateId);
    const resumeVersion = await this.resumeVersionRepository.save({
      about: dto.about,
      avatar: uploadImage[0].secure_url,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      education: { id: +dto.education },
      location: dto.location,
      phone: dto.phone,
      district: { id: dto.district },
      resume: { id: +resume.id },
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
    return resumeVersion;
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
          candidate: { id: +candidateId },
        },
        id: +resumeId,
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
