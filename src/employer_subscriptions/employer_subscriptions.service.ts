import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { EmployerSubscription } from './entities/employer_subscription.entity';
import { PackagesService } from 'src/packages/packages.service';
import {
  CreateEmployerSubscriptionDto,
  UseSubscriptionDto,
} from './dto/create-employer_subscription.dto';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class EmployerSubscriptionsService {
  constructor(
    @InjectRepository(EmployerSubscription)
    private readonly employerSubscriptionRepository: Repository<EmployerSubscription>,
    private readonly packageService: PackagesService,
    private readonly transactionService: TransactionService,
  ) {}

  async triggerEmployerRegister(employerId: number) {
    const freePackage = await this.packageService.findOneById('FREE_PACKAGE');
    if (!freePackage) {
      throw new BadRequestException('Free package not found');
    }
    const transaction = await this.transactionService.createTransaction({
      amount: freePackage.price,
      employerId: employerId,
      transactionType: 'SUBSCRIPTION',
    });
    const endDate = freePackage.dayValue
      ? new Date(Date.now() + freePackage.dayValue * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const create = this.employerSubscriptionRepository.create({
      transaction: transaction,
      package: freePackage,
      startDate: new Date(),
      endDate: endDate,
      note: 'Gói miễn phí do hệ thống cấp khi đăng ký nhà tuyển dụng',
      status: 'ACTIVE',
    });
    return this.employerSubscriptionRepository.save(create);
  }

  async getMySubscription(employerId: number) {
    return this.employerSubscriptionRepository.find({
      where: {
        transaction: { employer: { id: employerId } },
      },
      relations: {
        package: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getMySubscriptionNonJobStatusActive(employerId: number) {
    return this.employerSubscriptionRepository.find({
      where: {
        transaction: { employer: { id: employerId } },
        job: { id: IsNull() },
        endDate: MoreThanOrEqual(new Date()),
        status: 'ACTIVE',
      },
      relations: {
        package: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createEmployerSubscriptions(
    employerId: number,
    body: CreateEmployerSubscriptionDto[],
    amount: number,
  ) {
    const dataSubs: EmployerSubscription[] = [];
    const transaction = await this.transactionService.createTransaction({
      amount,
      employerId: employerId,
      transactionType: 'SUBSCRIPTION',
    });
    console.log(body);
    for (const item of body) {
      const packageData = await this.packageService.findOneById(item.packageId);
      if (!packageData) {
        throw new BadRequestException('Package not found');
      }
      const dataSub = {
        transaction: transaction,
        package: packageData,
        startDate: new Date(),
        endDate: new Date(
          Date.now() + packageData.dayValue * 24 * 60 * 60 * 1000,
        ),
        note: 'Mua gói dịch vụ từ hệ thống',
        status: 'ACTIVE',
      } as EmployerSubscription;
      for (let i = 0; i < item.quantity; i++) {
        dataSubs.push(this.employerSubscriptionRepository.create(dataSub));
      }
    }
    return await this.employerSubscriptionRepository.save(dataSubs);
  }
  async useSubscription(employerId: number, body: UseSubscriptionDto) {
    const isExist = await this.employerSubscriptionRepository.findOne({
      where: {
        job: { id: body.jobId },
      },
    });
    if (isExist) {
      throw new BadRequestException(
        'Công việc đang được sử dụng 1 gói đăng ký nào đó',
      );
    }
    const employerSubscription =
      await this.employerSubscriptionRepository.findOne({
        where: {
          id: body.subscriptionId,
          transaction: { employer: { id: employerId } },
          job: { id: IsNull() },
          endDate: MoreThanOrEqual(new Date()),
          status: 'ACTIVE',
        },
        relations: {
          package: true,
          job: true,
        },
      });
    if (!employerSubscription) {
      throw new BadRequestException(
        'Không tìm thấy gói đăng ký hoặc gói đã được sử dụng',
      );
    }
    if (employerSubscription.endDate < new Date()) {
      throw new BadRequestException('Gói đăng ký đã hết hạn');
    }
    if (employerSubscription?.job?.id) {
      throw new BadRequestException(
        'Gói đăng ký đã được sử dụng cho công việc khác',
      );
    }
    return this.employerSubscriptionRepository.save({
      ...employerSubscription,
      job: { id: body.jobId },
    });
  }
}
