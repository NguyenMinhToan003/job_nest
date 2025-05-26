import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotiAccount } from './entities/noti-account.entity';
import { Repository } from 'typeorm';
import { CreateNotiAccountDto } from './dto/create-noti-account.dto';

@Injectable()
export class NotiAccountService {
  constructor(
    @InjectRepository(NotiAccount)
    private notiAccountRepository: Repository<NotiAccount>,
  ) {}
  async create(accountId: number, dto: CreateNotiAccountDto) {
    return this.notiAccountRepository.save({
      content: dto.content,
      link: dto.link,
      title: dto.title,
      type: dto.type,
      senderAccount: { id: accountId },
      receiverAccount: { id: dto.receiverAccountId },
    });
  }
  async getMe(accountId: number) {
    return this.notiAccountRepository.find({
      where: { receiverAccount: { id: accountId } },
      relations: {
        senderAccount: {
          candidate: true,
          employer: true,
        },
      },
      order: { time: 'DESC' },
    });
  }

  async markAllAsRead(accountId: number) {
    return this.notiAccountRepository.update(
      { receiverAccount: { id: +accountId }, isRead: 0 },
      { isRead: 1 },
    );
  }
  async countUnread(accountId: number) {
    return this.notiAccountRepository.count({
      where: { receiverAccount: { id: accountId }, isRead: 0 },
    });
  }
}
