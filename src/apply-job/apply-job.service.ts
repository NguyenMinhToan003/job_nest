import { Injectable } from '@nestjs/common';
import { CreateApplyJobDto } from './dto/create-apply-job.dto';
import { UpdateApplyJobDto } from './dto/update-apply-job.dto';

@Injectable()
export class ApplyJobService {
  create(createApplyJobDto: CreateApplyJobDto) {
    return 'This action adds a new applyJob';
  }

  findAll() {
    return `This action returns all applyJob`;
  }

  findOne(id: number) {
    return `This action returns a #${id} applyJob`;
  }

  update(id: number, updateApplyJobDto: UpdateApplyJobDto) {
    return `This action updates a #${id} applyJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} applyJob`;
  }
}
