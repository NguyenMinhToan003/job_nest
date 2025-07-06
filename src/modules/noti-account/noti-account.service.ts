import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotiAccount } from './entities/noti-account.entity';
import { Repository } from 'typeorm';
import { CreateNotiAccountDto, FilterNotiAccountDto } from './dto/create-noti-account.dto';
import { AccountService } from '../account/account.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotiAccountService {
  constructor(
    @InjectRepository(NotiAccount)
    private notiAccountRepository: Repository<NotiAccount>,
    private mailerService: MailerService,
    private accountService: AccountService,
  ) {}
  async create(accountId: number, dto: CreateNotiAccountDto) {
    const receiverAccount = await this.accountService.findOne({
      id: dto.receiverAccountId,
    });
    console.log('receiverAccount', receiverAccount.email);
    await this.mailerService.sendMail({
      to: receiverAccount.email,
      from: 'tuyendung123@gmail.com',
      subject: dto.title,
      template: 'job-status',
      context: {
        content: dto.content,
        link: dto.link,
        title: dto.title,
      },
    });
    return this.notiAccountRepository.save({
      content: dto.content,
      link: dto.link,
      title: dto.title,
      type: dto.type,
      senderAccount: { id: accountId },
      receiverAccount: { id: dto.receiverAccountId },
    });
  }
  async getMe(accountId: number, query: FilterNotiAccountDto) {
    if (!query.page || query.page < 1) {
      query.page = 1;
    }
    if (!query.limit || query.limit < 1) {
      query.limit = 4;
    }

    const [items, total] = await this.notiAccountRepository.findAndCount({
      where: { receiverAccount: { id: accountId } },
      relations: {
        senderAccount: {
          candidate: true,
          employer: true,
        },
      },
      order: { time: 'DESC' },
      skip: (query.page - 1) * (query.limit || 10),
      take: query.limit || 10,
    });
    const unreadCount = await this.countUnread(accountId);
    const totalPage = Math.ceil(total / (query.limit || 10));
    return {
      items,
      total,
      totalPage,
      unreadCount,
    };
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
  async markAsRead(accountId: number, id: number) {
    return this.notiAccountRepository.update(
      { id, receiverAccount: { id: accountId } },
      { isRead: 1 },
    );
  }
}
