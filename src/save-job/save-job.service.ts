import { Injectable } from '@nestjs/common';
import { CreateSaveJobDto } from './dto/create-save-job.dto';
import { UpdateSaveJobDto } from './dto/update-save-job.dto';

@Injectable()
export class SaveJobService {
  create(createSaveJobDto: CreateSaveJobDto) {
    return 'This action adds a new saveJob';
  }

  findAll() {
    return `This action returns all saveJob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saveJob`;
  }

  update(id: number, updateSaveJobDto: UpdateSaveJobDto) {
    return `This action updates a #${id} saveJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} saveJob`;
  }
}
