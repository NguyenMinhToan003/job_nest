import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { PackagesService } from 'src/packages/packages.service';
import { EmployerSubscriptionsService } from 'src/employer_subscriptions/employer_subscriptions.service';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly packageService: PackagesService,
    private readonly employerSubscriptionService: EmployerSubscriptionsService,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    let amount = 0;
    for (const subscription of dto.subscriptions) {
      const packageDetail = await this.packageService.findOneById(
        subscription.packageId,
      );
      if (!packageDetail) {
        throw new BadRequestException('Package not found');
      }
      amount += packageDetail.price * subscription.quantity;
    }
    const create = this.transactionRepository.create({
      amount: amount,
      employer: { id: dto.employerId },
      transactionType: dto.transactionType,
    });
    const transaction = await this.transactionRepository.save(create);
    await this.employerSubscriptionService.createEmployerSubscriptions(
      dto.subscriptions,
      transaction.id,
    );
    return transaction;
  }

  async getMyTransactions(employerId: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        employer: { id: employerId },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const transactionPackages = [];
    for (const transaction of transactions) {
      const packageDetails =
        await this.packageService.getDetailTransactionPackage(transaction.id);
      const packageConverted =
        await this.convertPackageResponse(packageDetails);
      transactionPackages.push({
        ...transaction,
        package: packageConverted,
      });
    }
    return transactionPackages;
  }

  async getTransactionById(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        employer: true,
        employerSubscriptions: {
          package: true,
          job: true,
        },
      },
    });
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }
    const packageDetails =
      await this.packageService.getDetailTransactionPackage(id);

    const packageConvert = this.convertPackageResponse(packageDetails);
    return {
      ...transaction,
      package: packageConvert,
    };
  }
  private convertPackageResponse(packageDetails: any[]) {
    return packageDetails.map((pkg) => {
      const sub_used = pkg.employerSubscriptions.filter(
        (sub) => sub?.job !== null,
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
    });
  }

  async update(id: number, dto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }
    await this.transactionRepository.save({
      id: id,
      status: dto.status,
      vnp_TxnRef: dto.vnp_TxnRef || transaction.vnp_TxnRef,
      recordedAt: dto.recordedAt || transaction.recordedAt,
    });
    return this.transactionRepository.findOne({ where: { id } });
  }
  async findOne(id: number) {
    return this.transactionRepository.findOne({
      where: { id },
      relations: {
        employer: true,
      },
    });
  }
  async findOneByVnpTxnRef(vnp_TxnRef: string) {
    return this.transactionRepository.findOne({
      where: { vnp_TxnRef },
      relations: {
        employer: {
          account: true,
        },
        employerSubscriptions: {
          package: true,
        },
      },
    });
  }

  async getTransactionDetail(employerId: number, transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: transactionId,
        employer: { id: employerId },
      },
      relations: {
        employer: true,
        employerSubscriptions: {
          package: true,
          job: true,
        },
      },
    });
    if (!transaction) {
      throw new BadRequestException('Mã giao dịch không hợp lệ');
    }
    return transaction;
  }
}
