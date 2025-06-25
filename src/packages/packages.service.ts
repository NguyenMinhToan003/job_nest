import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Not, Repository } from 'typeorm';
import { PackageType, PAYMENT_STATUS } from 'src/types/enum';
import { CreatePackageDto } from './dto/create-package.dto';
import { UploadService } from 'src/upload/upload.service';

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
        id: 'FREE_PACKAGE',
        name: 'Gói miễn phí',
        type: PackageType.JOB,
        features: 'Đăng tuyển 1 việc làm miễn phí',
        price: 0,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/basic_post-min_170364707414.png',
        dayValue: 30,
      },
      {
        id: 'BASIC_PACKAGE',
        name: 'Gói cơ bản',
        type: PackageType.JOB,
        features: 'Đăng tuyển 5 việc làm, xem 100 hồ sơ ứng viên',
        price: 50000,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/basic_post-min_170364707414.png',
        dayValue: 30,
      },
      {
        id: 'PRO_PACKAGE',
        name: 'Gói chuyên nghiệp',
        features: 'Đăng tuyển 10 việc làm, xem 200 hồ sơ ứng viên',
        price: 100000,
        type: PackageType.JOB,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/refresh_hourly-min_170364713622.png',
        dayValue: 30,
      },
      {
        id: 'PREMIUM_PACKAGE',
        name: 'Gói cao cấp',
        features: 'Đăng tuyển 20 việc làm, xem 500 hồ sơ ứng viên',
        price: 200000,
        type: PackageType.BANNER,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/points-min_170364712744.png',
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
  async findInBisiness() {
    return this.packageRepository.find();
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

  async findAvailablePackages(employerId: number) {
    const packages = await this.packageRepository.find({
      where: {
        employerSubscriptions: {
          transaction: {
            employer: { id: employerId },
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

    const convertPackagesResult = packages
      .map((pkg) => {
        const sub_used = pkg.employerSubscriptions.filter(
          (sub) => sub.job !== null,
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
          sub_total: pkg.employerSubscriptions.length,
        };
      })
      .filter((pkg) => pkg.sub_total > pkg.sub_used);
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
}
