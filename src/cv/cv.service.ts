import { Injectable } from '@nestjs/common';
import { UploadService } from 'src/upload/upload.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CvService {
  @InjectRepository(Cv)
  private readonly cvRepository: Repository<Cv>;
  constructor(private readonly uploadService: UploadService) {}
  async create(
    file: {
      cv?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
    dto: CreateCvDto,
  ) {
    try {
      const cv = file.cv[0];
      const files = await this.uploadService.uploadFile([cv]);
      console.log('files', files);
      return this.cvRepository.save({
        publicId: files[0].public_id,
        url: files[0].secure_url,
        user: { id: dto.userId },
      });
    } catch (error) {
      console.log('error', error);
      throw new Error('Error creating CV');
    }
  }
}
