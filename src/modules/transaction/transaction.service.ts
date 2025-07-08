import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import {
  AdminFilterTransactionDto,
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { PackagesService } from '../packages/packages.service';
import { EmployerSubscriptionsService } from '../employer_subscriptions/employer_subscriptions.service';
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
      transactionType: dto.transactionType,
      note: 'Giao dịch thanh toán',
    });
    const transaction = await this.transactionRepository.save(create);

    await this.employerSubscriptionService.createEmployerSubscriptions(
      dto.subscriptions,
      dto.employerId,
      transaction.id,
    );
    return transaction;
  }

  async getMyTransactions(employerId: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        employerSubscriptions: {
          employer: { id: employerId },
        },
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

  async getAllTransactions(query: AdminFilterTransactionDto) {
    const where = {};
    if (query.status) {
      where['status'] = query.status;
    }
    if (query.vnp_TxnRef) {
      where['vnp_TxnRef'] = query.vnp_TxnRef;
    }
    if (query.employerId) {
      where['employerSubscriptions'] = {
        employer: { id: query.employerId },
      };
    }
    const order = {};
    if (query.sortBy) {
      order[query.sortBy] = query.sortOrder === 'asc' ? 'ASC' : 'DESC';
    } else {
      order['createdAt'] = 'DESC';
    }
    if (!query.page) {
      query.page = 1;
    }
    if (!query.limit) {
      query.limit = 10;
    }

    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        where,
        order,
        relations: {
          employerSubscriptions: {
            package: true,
            employer: true,
            job: true,
          },
        },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      },
    );
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
    const totalPages = Math.ceil(total / query.limit);
    return {
      items: transactionPackages,
      total,
      totalPages,
    };
  }
  async getTransactionById(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        employerSubscriptions: {
          package: true,
          employer: true,
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
        employerSubscriptions: {
          package: true,
          employer: true,
          job: true,
        },
      },
    });
  }
  async findOneByVnpTxnRef(vnp_TxnRef: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { vnp_TxnRef },
      relations: {
        employerSubscriptions: {
          package: true,
          employer: {
            account: true,
          },
          job: true,
        },
      },
    });
  }

  async getTransactionDetail(transactionId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: transactionId,
      },
      relations: {
        employerSubscriptions: {
          package: true,
          employer: true,
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
