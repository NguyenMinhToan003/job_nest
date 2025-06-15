import { EmployerSubscription } from 'src/employer_subscriptions/entities/employer_subscription.entity';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'giao_dich' })
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({
    name: 'ngay_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ name: 'so_tien', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    name: 'loai_giao_dich',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  transactionType: string;

  @Column({ name: 'trang_thai', type: 'varchar', length: 50, nullable: false })
  status: string;

  @Column({ name: 'ngay_ghi_nhan', type: 'timestamp', nullable: true })
  recordedAt: Date;

  @ManyToOne(() => Employer, (employer) => employer.transactions, {
    nullable: false,
  })
  employer: Employer;

  @OneToMany(
    () => EmployerSubscription,
    (subscription) => subscription.transaction,
  )
  employerSubscriptions: EmployerSubscription[];
}
