import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { EmployerSubscription } from './entities/employer_subscription.entity';
import {
  CreateEmployerSubscriptionDto,
  UseSubBannerDto,
  UseSubscriptionDto,
} from './dto/create-employer_subscription.dto';
import {
  EMPLOYER_SUBSCRIPTION_STATUS,
  PackageType,
  PAYMENT_STATUS,
} from 'src/types/enum';
import * as dayjs from 'dayjs';
import { PackagesService } from '../packages/packages.service';

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
        transaction: {
          employerSubscriptions: {
            employer: { id: employerId },
          },
        },
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
          employerSubscriptions: {
            employer: { id: employerId },
          },
          status: PAYMENT_STATUS.SUCCESS,
        },
        job: { id: IsNull() },
        endDate: MoreThanOrEqual(new Date()),
        status: EMPLOYER_SUBSCRIPTION_STATUS.ACTIVE,
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
    employerId: number,
    transactionId: number,
  ) {
    const dataSubs: EmployerSubscription[] = [];
    for (const item of body) {
      const packageData = await this.packageService.findOneById(item.packageId);
      if (!packageData) {
        throw new BadRequestException('Gói dịch vụ không hợp lệ');
      }
      const dataSub = {
        transaction: { id: transactionId },
        job: null,
        employer: { id: employerId },
        package: packageData,
        startDate: null,
        endDate: null,
        note: item.note || 'Mặc định',
        status: EMPLOYER_SUBSCRIPTION_STATUS.INACTIVE,
      } as EmployerSubscription;
      for (let i = 0; i < item.quantity; i++) {
        dataSubs.push(this.employerSubscriptionRepository.create(dataSub));
      }
    }
    return await this.employerSubscriptionRepository.save(dataSubs);
  }

  async triggerTransactionSuccess(transactionId: number) {
    const subscriptions = await this.employerSubscriptionRepository.find({
      where: {
        transaction: { id: transactionId },
        status: EMPLOYER_SUBSCRIPTION_STATUS.INACTIVE,
      },
    });
    if (subscriptions.length === 0) {
      throw new BadRequestException('Không có gói dịch vụ nào để kích hoạt');
    }
    for (const sub of subscriptions) {
      sub.status = EMPLOYER_SUBSCRIPTION_STATUS.ACTIVE;
    }
    return this.employerSubscriptionRepository.save(subscriptions);
  }

  async useSubscriptionJob(employerId: number, body: UseSubscriptionDto) {
    const validate = await this.employerSubscriptionRepository.findOne({
      where: {
        employer: { id: employerId },
        transaction: {
          status: PAYMENT_STATUS.SUCCESS,
        },
        job: { id: IsNull() },
        package: { id: body.packageId },
        status: EMPLOYER_SUBSCRIPTION_STATUS.ACTIVE,
      },
      relations: {
        package: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });
    if (!validate) {
      throw new BadRequestException('Sử dụng gói dịch vụ không hợp lệ');
    }
    const validateJob = await this.employerSubscriptionRepository.findOne({
      where: {
        job: { id: body.jobId },
        endDate: MoreThanOrEqual(new Date()),
        package: {
          type: validate.package.type,
        },
      },
      relations: {
        package: true,
      },
    });
    if (validateJob) {
      throw new BadRequestException(
        'Loại dịch vụ này đang được sử dụng chưa hết hạn',
      );
    }
    const validatePendding = await this.employerSubscriptionRepository.findOne({
      where: {
        employer: { id: employerId },
        transaction: {
          status: PAYMENT_STATUS.SUCCESS,
        },
        job: { id: body.jobId },
        package: { id: body.packageId },
        status: EMPLOYER_SUBSCRIPTION_STATUS.PENDING,
      },
      relations: {
        package: true,
      },
      order: {
        createdAt: 'ASC',
      },
    });
    if (validatePendding) {
      throw new BadRequestException(
        'Vui lòng chờ đội ngũ quản trị duyệt gói dịch vụ này trước khi sử dụng',
      );
    }
    await this.employerSubscriptionRepository.save({
      ...validate,
      job: { id: body.jobId },
      status: body.status,
      startDate:
        body.status === EMPLOYER_SUBSCRIPTION_STATUS.USED ? new Date() : null,
      endDate:
        body.status === EMPLOYER_SUBSCRIPTION_STATUS.USED
          ? dayjs().add(validate.package.dayValue, 'day').toDate()
          : null,
    });
    return {
      message: 'Sử dụng gói dịch vụ thành công',
      data: validate,
    };
  }
  async triggerAdminActiveJob(jobId: number) {
    const subs_pending = await this.employerSubscriptionRepository.find({
      where: {
        job: { id: jobId },
        status: EMPLOYER_SUBSCRIPTION_STATUS.PENDING,
      },
      relations: {
        package: true,
      },
    });
    if (subs_pending.length > 0) {
      for (const sub of subs_pending) {
        sub.status = EMPLOYER_SUBSCRIPTION_STATUS.USED;
        sub.startDate = new Date();
        sub.endDate = dayjs().add(sub.package.dayValue, 'day').toDate();
      }
      return this.employerSubscriptionRepository.save(subs_pending);
    }
    return null;
  }
  async triggerAdminBlockJob(jobId: number) {
    const subs_pending = await this.employerSubscriptionRepository.find({
      where: {
        job: { id: jobId },
        status: EMPLOYER_SUBSCRIPTION_STATUS.PENDING,
      },
    });
    if (subs_pending.length > 0) {
      for (const sub of subs_pending) {
        sub.status = EMPLOYER_SUBSCRIPTION_STATUS.ACTIVE;
        sub.job = null;
      }
      return this.employerSubscriptionRepository.save(subs_pending);
    }
    return null;
  }

  async getSubscriptionPackageJobByJobId(jobId: number) {
    return this.employerSubscriptionRepository.findOne({
      where: {
        job: { id: jobId },
        endDate: MoreThanOrEqual(new Date()),
        package: { type: PackageType.JOB },
        status: EMPLOYER_SUBSCRIPTION_STATUS.USED,
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
          employerSubscriptions: {
            employer: { id: employerId },
          },
          status: PAYMENT_STATUS.SUCCESS,
        },
        package: { type: PackageType.EMPLOYER },
        job: { id: IsNull() },
        status: EMPLOYER_SUBSCRIPTION_STATUS.ACTIVE,
      },
      relations: {
        package: true,
      },
    });
    if (!validate) {
      throw new BadRequestException('Sử dụng gói dịch vụ không hợp lệ');
    }
    const checkEmployerIsUsingBanner =
      await this.employerSubscriptionRepository.findOne({
        where: {
          id: Not(body.employerSubId),
          job: { id: IsNull() },
          endDate: MoreThanOrEqual(new Date()),
          package: {
            type: PackageType.EMPLOYER,
          },
          transaction: {
            employerSubscriptions: {
              employer: { id: employerId },
            },
            status: PAYMENT_STATUS.SUCCESS,
          },
          status: EMPLOYER_SUBSCRIPTION_STATUS.USED,
        },
        relations: {
          package: true,
        },
      });
    if (checkEmployerIsUsingBanner) {
      throw new BadRequestException(
        'Bạn đang sử dụng gói dịch vụ banner chưa hết hạn',
      );
    }
    await this.employerSubscriptionRepository.save({
      ...validate,
      job: null,
      status: EMPLOYER_SUBSCRIPTION_STATUS.USED,
      startDate: new Date(),
      endDate: dayjs().add(validate.package.dayValue, 'day').toDate(),
    });
    return {
      message: 'Sử dụng gói dịch vụ thành công',
      data: validate,
    };
  }
  async getAllInPackage(packageId: string) {
    return this.employerSubscriptionRepository.find({
      where: {
        package: { id: packageId },
      },
      relations: {
        employer: true,
        job: true,
        transaction: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
