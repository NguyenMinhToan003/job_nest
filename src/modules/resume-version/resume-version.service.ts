import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResumeVersion } from './entities/resume-version.entity';
import { In, Like, Repository } from 'typeorm';
import {
  CreateResumeVersionDto,
  QueryDto,
} from './dto/create-resume-version.dto';
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
    files: {
      avatar?: Express.Multer.File[] | null;
      cv?: Express.Multer.File[] | null;
    },
    resumeId: number,
  ) {
    let uploadImage = dto.avatar;
    if (dto.avatar === undefined) {
      const upload = await this.uploadService.uploadFile(files.avatar);
      uploadImage = upload[0].secure_url;
    }
    const cv = await this.uploadService.uploadFile(files.cv);

    const resumeVersion = await this.resumeVersionRepository.save({
      avatar: uploadImage,
      dateOfBirth: dto.dateOfBirth,
      gender: dto.gender,
      location: dto.location,
      typeJob: { id: dto.typeJobId },
      phone: dto.phone,
      expectedSalary: dto.expectedSalary,
      district: { id: dto.district },
      education: { id: dto.education },
      email: dto.email,
      resume: { id: +resumeId },
      username: dto.username,
      majors: dto.majors ? dto.majors.map((id) => ({ id: +id })) : [],
      level: { id: +dto.level },
      skills: dto.skills ? dto.skills.map((id) => ({ id: +id })) : [],
      publicIdPdf: cv[0].display_name,
      urlPdf: cv[0].secure_url,
    });
    if (dto?.languageResumes?.length > 0) {
      for (const languageResume of dto.languageResumes) {
        await this.languageResumeService.create({
          languageId: languageResume.languageId,
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
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async viewVersion(resumeVersion: number) {
    const version = await this.resumeVersionRepository.findOne({
      where: {
        id: +resumeVersion,
      },
      relations: {
        level: true,
        district: {
          city: true,
        },
        languageResumes: {
          language: true,
        },
        education: true,
        skills: true,
        resume: true,
        majors: true,
      },
    });
    if (!version) {
      throw new BadRequestException('Phiên bản Hồ sơ không tồn tại');
    }
    return version;
  }

  async update(
    candidateId: number,
    dto: CreateResumeVersionDto,
    files: {
      avatar?: Express.Multer.File[] | null;
      cv?: Express.Multer.File[] | null;
    },
    resumeId: number,
  ) {
    const resume = await this.resumeService.validateMe(candidateId, resumeId);
    if (!resume) {
      throw new BadRequestException('Bạn không có quyền sửa đổi Hồ sơ này');
    }
    this.resumeService.update(candidateId, resumeId, dto.name);
    const lastResumeVersion = await this.viewResume(candidateId, resumeId);
    let uploadImage = [];
    if (files?.avatar?.length > 0)
      uploadImage = await this.uploadService.uploadFile(files.avatar);
    if (files?.cv?.length > 0) {
      const cv = await this.uploadService.uploadFile(files.cv);
      dto.publicIdPdf = cv[0].display_name;
      dto.urlPdf = cv[0].secure_url;
    } else {
      dto.publicIdPdf = lastResumeVersion.publicIdPdf;
      dto.urlPdf = lastResumeVersion.urlPdf;
    }
    const resumeVersion = await this.resumeVersionRepository.save({
      avatar: uploadImage[0]?.secure_url ?? lastResumeVersion.avatar,
      dateOfBirth: dto.dateOfBirth ?? lastResumeVersion.dateOfBirth,
      gender: dto.gender ?? lastResumeVersion.gender,
      majors: dto.majors
        ? dto.majors.map((id) => ({ id: +id }))
        : lastResumeVersion.majors,
      education: { id: dto.education ?? lastResumeVersion.education.id },
      location: dto.location ?? lastResumeVersion.location,
      phone: dto.phone ?? lastResumeVersion.phone,
      typeJob: { id: dto.typeJobId ?? lastResumeVersion.typeJob.id },
      district: { id: dto.district ?? lastResumeVersion.district.id },
      email: dto.email ?? lastResumeVersion.email,
      resume: { id: +resumeId },
      username: dto.username ?? lastResumeVersion.username,
      level: { id: dto.level ?? lastResumeVersion.level.id },
      skills: dto.skills ? dto.skills.map((id) => ({ id: +id })) : [],
      publicIdPdf: dto.publicIdPdf ?? lastResumeVersion.publicIdPdf,
      urlPdf: dto.urlPdf ?? lastResumeVersion.urlPdf,
    });
    if (dto?.languageResumes?.length > 0) {
      for (const languageResume of dto.languageResumes) {
        await this.languageResumeService.create({
          languageId: languageResume.languageId,
          resumeVersionId: resumeVersion.id,
        });
      }
    }
  }

  async viewResume(candidateId: number, resumeId: number) {
    const resume = await this.getOne(candidateId, +resumeId);
    if (!resume) {
      throw new BadRequestException('Hồ sơ không tồn tại');
    }
    return this.resumeVersionRepository.findOne({
      where: {
        resume: {
          candidate: { id: +candidateId },
          id: +resumeId,
        },
      },
      relations: {
        level: true,
        district: {
          city: true,
        },
        languageResumes: {
          language: true,
        },
        education: true,
        skills: true,
        resume: true,
        majors: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async getActiveDefaultResume(candidateId: number) {
    return this.resumeVersionRepository.findOne({
      where: {
        resume: {
          candidate: { id: +candidateId },
          isDefault: true,
        },
      },
      relations: {
        skills: true,
        languageResumes: {
          language: true,
        },
        education: true,
        majors: true,
        level: true,
        district: {
          city: true,
        },
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async search(query: QueryDto) {
    if (!query.page) query.page = 1;
    if (!query.limit) query.limit = 10;
    const [items, total] = await this.resumeVersionRepository.findAndCount({
      where: {
        resume: {
          name: query?.search ? Like(`%${query?.search}%`) : undefined,
          isDefault: true,
        },
        skills: query?.skills ? { id: In(query?.skills) } : undefined,
        level: query?.levels ? { id: In(query?.levels) } : undefined,
      },
      relations: {
        resume: true,
        skills: true,
        languageResumes: {
          language: true,
        },
        education: true,
        majors: true,
        level: true,
        district: {
          city: true,
        },
      },
      skip: (query?.page - 1) * query?.limit,
      take: query?.limit,
    });
    const totalPages = Math.ceil(total / query?.limit);
    return {
      items,
      total,
      totalPages,
      limit: query.limit,
      page: query.page,
    };
  }
}
