import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CvService {
  @InjectRepository(Cv)
  private readonly cvRepository: Repository<Cv>;
  constructor(private readonly uploadService: UploadService) {}
  async create(cv: Express.Multer.File, userId: number) {
    const arrayName = cv.originalname.split('.');
    const typeFile = arrayName[arrayName.length - 1];
    const arrayTypeFile = ['pdf', 'docx', 'doc'];
    if (!arrayTypeFile.includes(typeFile)) {
      throw new BadRequestException('Chỉ chấp nhận file pdf, docx, doc');
    }
    const cloudinaryFile = await this.uploadService.uploadFile([cv]);
    return this.cvRepository.save({
      publicId: cloudinaryFile[0].display_name,
      url: cloudinaryFile[0].secure_url,
      user: { id: userId },
      typeFile: typeFile,
      name: cv.originalname,
      updatedAt: new Date(),
    });
  }

  async findAllByUserId(userId: number) {
    return await this.cvRepository.find({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
    });
  }

  async findCvByUserIdAndCvId(userId: number, cvId: number) {
    console.log(userId, cvId);
    return await this.cvRepository.findOne({
      where: { user: { id: +userId }, id: +cvId },
    });
  }
  async findOne(id: number) {
    return await this.cvRepository.findOne({
      where: { id: +id },
    });
  }
}
