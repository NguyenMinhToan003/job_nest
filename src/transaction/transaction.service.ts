import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PackagesService } from 'src/packages/packages.service';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly packageService: PackagesService,
  ) {}

  async createTransaction(dto: CreateTransactionDto) {
    const transaction = this.transactionRepository.create({
      amount: dto.amount,
      employer: { id: dto.employerId },
      transactionType: dto.transactionType,
    });
    return this.transactionRepository.save(transaction);
  }

  async getMyTransactions(employerId: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        employer: { id: employerId },
      },
    });
    const transactionPackages = [];
    for (const transaction of transactions) {
      const packageDetails =
        await this.packageService.getDetailTransactionPackage(transaction.id);
      transactionPackages.push({
        ...transaction,
        package: packageDetails,
      });
    }
    return transactionPackages;
  }
}
