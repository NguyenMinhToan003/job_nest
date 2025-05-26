import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerNoti } from './entities/employer-noti.entity';
import { Repository } from 'typeorm';
import { CreateEmployerNotiDto } from './dto/create-employer-noti.dto';

@Injectable()
export class EmployerNotiService {
  constructor(
    @InjectRepository(EmployerNoti)
    private employerNotiRepository: Repository<EmployerNoti>,
  ) {}
  async create(dto: CreateEmployerNotiDto) {
    return this.employerNotiRepository.save({
      content: dto.content,
      link: dto.link,
      type: dto.type,
      employer: { id: dto.employerId },
    });
  }
  async findAllByEmployerId(employerId: number) {
    return this.employerNotiRepository.find({
      where: { employer: { id: employerId } },
      order: { time: 'DESC' },
    });
  }

  async markAllAsRead(employerId: number) {
    return this.employerNotiRepository.update(
      { employer: { id: employerId }, isRead: 0 },
      { isRead: 1 },
    );
  }
  async countUnread(employerId: number) {
    return this.employerNotiRepository.count({
      where: { employer: { id: employerId }, isRead: 0 },
    });
  }

  async applyNoti(candidateId: number, dto: CreateEmployerNotiDto) {
    return this.employerNotiRepository.save({
      content: dto.content,
      link: dto.link,
      type: dto.type,
      employer: { id: dto.employerId },
      candidate: { id: candidateId },
    });
  }
}
