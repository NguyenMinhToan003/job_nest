import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { EmployerSubscription } from './entities/employer_subscription.entity';
import { PackagesService } from 'src/packages/packages.service';
import {
  CreateEmployerSubscriptionDto,
  UseSubscriptionDto,
} from './dto/create-employer_subscription.dto';
import { PAYMENT_STATUS } from 'src/types/enum';

@Injectable()
export class EmployerSubscriptionsService {
  constructor(
    @InjectRepository(EmployerSubscription)
    private readonly employerSubscriptionRepository: Repository<EmployerSubscription>,
    private readonly packageService: PackagesService,
  ) {}

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
        transaction: {
          employer: { id: employerId },
          status: PAYMENT_STATUS.SUCCESS,
        },
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
    body: CreateEmployerSubscriptionDto[],
    transactionId: number,
  ) {
    const dataSubs: EmployerSubscription[] = [];
    for (const item of body) {
      const packageData = await this.packageService.findOneById(item.packageId);
      if (!packageData) {
        throw new BadRequestException('Package not found');
      }
      const dataSub = {
        transaction: { id: transactionId },
        job: null,
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
    const validate = await this.employerSubscriptionRepository.findOne({
      where: {
        transaction: {
          employer: { id: employerId },
          status: PAYMENT_STATUS.SUCCESS,
        },
        job: { id: IsNull() },
        package: { id: body.packageId },
        status: 'ACTIVE',
      },
      order: {
        createdAt: 'ASC',
      },
    });
    if (!validate) {
      throw new BadRequestException('Sử dụng gói dịch vụ không hợp lệ');
    }
    await this.employerSubscriptionRepository.save({
      ...validate,
      job: { id: body.jobId },
      status: 'USED',
    });
    return {
      message: 'Sử dụng gói dịch vụ thành công',
      data: validate,
    };
  }
  async getSubscriptionByJobId(jobId: number) {
    return this.employerSubscriptionRepository.findOne({
      where: {
        job: { id: jobId },
        endDate: MoreThanOrEqual(new Date()),
      },
      relations: {
        package: true,
      },
    });
  }
}
