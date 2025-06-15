import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async createDefaultPackages() {
    const freePackage = this.packageRepository.create([
      {
        id: 'FREE_PACKAGE',
        name: 'Gói miễn phí',
        features: 'Đăng tuyển 1 việc làm miễn phí',
        price: 0,
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/basic_post-min_170364707414.png',
        dayValue: 30,
      },
      {
        id: 'BASIC_PACKAGE',
        name: 'Gói cơ bản',
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
        image:
          'https://cdn1.vieclam24h.vn/images/public/2023/12/27/refresh_hourly-min_170364713622.png',
        dayValue: 30,
      },
      {
        id: 'PREMIUM_PACKAGE',
        name: 'Gói cao cấp',
        features: 'Đăng tuyển 20 việc làm, xem 500 hồ sơ ứng viên',
        price: 200000,
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
    return this.packageRepository.find({
      where: {
        id: Not('FREE_PACKAGE'),
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
        employerSubscriptions: true,
      },
    });
    return packageDetail;
  }
}
