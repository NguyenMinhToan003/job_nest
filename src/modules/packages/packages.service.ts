import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import {
  EMPLOYER_SUBSCRIPTION_STATUS,
  PackageType,
  PAYMENT_STATUS,
} from 'src/types/enum';
import { CreatePackageDto, FilterPacageDto } from './dto/create-package.dto';
import { UploadService } from 'src/upload/upload.service';
import * as dayjs from 'dayjs';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    private readonly uploadService: UploadService,
  ) {}

  async createDefaultPackages() {
    const freePackage = this.packageRepository.create([
      {
        id: 'TRANG_CHU_TUYEN_GAP',
        name: 'Trang chủ tuyển gấp',
        type: PackageType.BANNER,
        features: 'Tin đăng hiển thị tại “Việc làm tuyển gấp” trên trang chủ.',
        price: 1000000,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/basic_post-min_170364707414.png',
        dayValue: 30,
      },
      {
        id: 'HIEU_UNG_TIN',
        name: 'Hiệu ứng tin tuyển dụng',
        features: 'Tin đăng hiển thị nổi bật trên trang tìm kiếm.',
        price: 1000000,
        type: PackageType.JOB,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/refresh_hourly-min_170364713622.png',
        dayValue: 30,
      },
      {
        id: 'LOGO_NOI_BAT',
        name: 'Logo nổi bật',
        features:
          'Logo của công ty sẽ hiển thị ở vị trí nổi bật và trung tâm nhất trên trang chủ.',
        price: 2000000,
        type: PackageType.EMPLOYER,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/points-min_170364712744.png',
        dayValue: 30,
      },
      {
        id: 'LAM_MOI_TIN',
        name: 'Làm mới mỗi ngày - Đăng tin cơ bản',
        features: 'Tin đăng được tự động làm mới mỗi ngày 1 lần',
        price: 500000,
        type: PackageType.REFRESH,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/refresh_daily-min_170364713021.png',
        dayValue: 30,
      },
    ]);
    return this.packageRepository.save(freePackage);
  }

  async findOneById(id: string): Promise<Package | null> {
    return this.packageRepository.findOne({
      where: { id },
    });
  }
  async findInBisiness(query?: FilterPacageDto) {
    return this.packageRepository.find({
      where: {
        status: true,
        type: In(
          query?.type || [
            PackageType.JOB,
            PackageType.BANNER,
            PackageType.EMPLOYER,
            PackageType.REFRESH,
          ],
        ),
      },
    });
  }
  async getDetailTransactionPackage(transactionId: number) {
    const packageDetail = await this.packageRepository.find({
      where: {
        employerSubscriptions: {
          transaction: { id: transactionId },
        },
      },
      relations: {
        employerSubscriptions: {
          job: true,
        },
      },
    });
    return packageDetail;
  }

  async findAvailablePackages(employerId: number, query?: FilterPacageDto) {
    const packages = await this.packageRepository.find({
      where: {
        type: In(
          query?.type || [
            PackageType.JOB,
            PackageType.BANNER,
            PackageType.EMPLOYER,
            PackageType.REFRESH,
          ],
        ),
        employerSubscriptions: {
          employer: { id: employerId },
          status: In([
            EMPLOYER_SUBSCRIPTION_STATUS.ACTIVE,
            EMPLOYER_SUBSCRIPTION_STATUS.USED,
            EMPLOYER_SUBSCRIPTION_STATUS.PENDING,
          ]),
          transaction: {
            status: PAYMENT_STATUS.SUCCESS,
          },
        },
      },
      relations: {
        employerSubscriptions: {
          transaction: true,
          job: true,
        },
      },
    });

    const convertPackagesResult = packages.map((pkg) => {
      const sub_used = pkg.employerSubscriptions.filter(
        (sub) =>
          sub.status === EMPLOYER_SUBSCRIPTION_STATUS.USED ||
          sub.status === EMPLOYER_SUBSCRIPTION_STATUS.PENDING,
      );
      const sub_using = sub_used.filter((sub) =>
        dayjs(sub.endDate).isAfter(dayjs(), 'day'),
      );
      const sub_pending = sub_used.filter(
        (sub) => sub.status === EMPLOYER_SUBSCRIPTION_STATUS.PENDING,
      );

      return {
        id: pkg.id,
        name: pkg.name,
        type: pkg.type,
        features: pkg.features,
        price: pkg.price,
        image: pkg.image,
        dayValue: pkg.dayValue,
        sub_used: sub_used.length,
        sub_using: sub_using,
        sub_pending: sub_pending,
        sub_total: pkg.employerSubscriptions.length,
      };
    });
    if (query?.mini) {
      return convertPackagesResult.filter(
        (pkg) => pkg.sub_total > pkg.sub_used,
      );
    }
    return convertPackagesResult;
  }
  async findAllPackages() {
    return this.packageRepository.find({
      order: {
        price: 'ASC',
      },
      relations: {
        employerSubscriptions: {
          transaction: true,
          job: true,
        },
      },
    });
  }
  async createPackage(dto: CreatePackageDto) {
    const checkPackageExits = await this.packageRepository.findOne({
      where: {
        dayValue: dto.dayValue,
        type: dto.type,
      },
    });
    if (checkPackageExits) {
      throw new BadRequestException('Gói dịch vụ đã tồn tại');
    }
    const uploadedImage = await this.uploadService.uploadFile([dto.image]);
    const newPackage = this.packageRepository.create({
      id: dto.name.toUpperCase().replace(/\s/g, '_'),
      name: dto.name,
      features: dto.features,
      price: dto.price,
      image: uploadedImage[0].secure_url,
      dayValue: dto.dayValue,
      type: dto.type,
    });
    return this.packageRepository.save(newPackage);
  }
  async deletePackage(packageId: string) {
    const packageToDelete = await this.packageRepository.findOne({
      where: { id: packageId },
    });
    if (!packageToDelete) {
      throw new BadRequestException('Package not found');
    }
    return this.packageRepository.remove(packageToDelete);
  }

  async getPackageUsedByJobId(jobId: number) {
    return this.packageRepository.find({
      where: {
        employerSubscriptions: {
          job: { id: jobId },
          endDate: MoreThanOrEqual(new Date()),
          status: EMPLOYER_SUBSCRIPTION_STATUS.USED,
          transaction: {
            status: PAYMENT_STATUS.SUCCESS,
          },
        },
      },
      relations: {
        employerSubscriptions: {
          transaction: true,
        },
      },
    });
  }
  async updatePackage(packageId: string, dto: CreatePackageDto) {
    const packageToUpdate = await this.packageRepository.findOne({
      where: { id: packageId },
    });
    if (!packageToUpdate) {
      throw new BadRequestException('Gói dịch vụ không tồn tại');
    }
    if (dto.image) {
      const uploadedImage = await this.uploadService.uploadFile([dto.image]);
      packageToUpdate.image = uploadedImage[0].secure_url;
    }
    packageToUpdate.name = dto.name;
    packageToUpdate.features = dto.features;
    packageToUpdate.price = dto.price;
    packageToUpdate.dayValue = dto.dayValue;
    packageToUpdate.type = dto.type;

    return this.packageRepository.save(packageToUpdate);
  }
  async changeStatusPackage(packageId: string) {
    const packageToUpdate = await this.packageRepository.findOne({
      where: { id: packageId },
    });
    if (!packageToUpdate) {
      throw new BadRequestException('Gói dịch vụ không tồn tại');
    }
    packageToUpdate.status = !packageToUpdate.status;
    return this.packageRepository.save(packageToUpdate);
  }
}
