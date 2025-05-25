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
  async create(cv: Express.Multer.File, candidateId: number) {
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
      candidate: { id: candidateId },
      typeFile: typeFile,
      name: cv.originalname,
      updatedAt: new Date(),
    });
  }

  async findAllByUserId(candidateId: number) {
    return await this.cvRepository.find({
      where: { candidate: { id: candidateId } },
      order: { updatedAt: 'DESC' },
    });
  }

  async findCvByUserIdAndCvId(candidateId: number, cvId: number) {
    console.log(candidateId, cvId);
    return await this.cvRepository.findOne({
      where: { candidate: { id: +candidateId }, id: +cvId },
    });
  }
  async findOne(id: number) {
    return await this.cvRepository.findOne({
      where: { id: +id },
    });
  }
}
