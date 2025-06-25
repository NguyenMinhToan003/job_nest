import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { EmployerSubscription } from './entities/employer_subscription.entity';
import { PackagesService } from 'src/packages/packages.service';
import {
  CreateEmployerSubscriptionDto,
  UseSubBannerDto,
  UseSubscriptionDto,
} from './dto/create-employer_subscription.dto';
import { PackageType, PAYMENT_STATUS } from 'src/types/enum';

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
        note: item.note || 'Mặc định',
        status: 'ACTIVE',
      } as EmployerSubscription;
      for (let i = 0; i < item.quantity; i++) {
        dataSubs.push(this.employerSubscriptionRepository.create(dataSub));
      }
    }
    return await this.employerSubscriptionRepository.save(dataSubs);
  }

  async useSubscriptionJob(employerId: number, body: UseSubscriptionDto) {
    const validateJob = await this.employerSubscriptionRepository.findOne({
      where: {
        job: { id: body.jobId },
        endDate: MoreThanOrEqual(new Date()),
        package: {
          type: In([PackageType.JOB, PackageType.BANNER]),
        },
      },
      relations: {
        package: true,
      },
    });
    if (validateJob) {
      throw new BadRequestException(
        'Tin đang sử dụng gói dich vụ chưa hết hạn',
      );
    }
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
  async useSubscriptionBanner(employerId: number, body: UseSubBannerDto) {
    const validate = await this.employerSubscriptionRepository.findOne({
      where: {
        id: body.employerSubId,
        transaction: {
          employer: { id: employerId },
          status: PAYMENT_STATUS.SUCCESS,
        },
        job: { id: IsNull() },
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
      job: null,
      status: 'USED',
    });
    return {
      message: 'Sử dụng gói dịch vụ thành công',
      data: validate,
    };
  }
}
