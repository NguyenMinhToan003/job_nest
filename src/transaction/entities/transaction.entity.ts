import { EmployerSubscription } from 'src/employer_subscriptions/entities/employer_subscription.entity';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import { PAYMENT_STATUS } from 'src/types/enum';
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

  @Column({
    name: 'ma_giao_dich',
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  vnp_TxnRef: string;

  @Column({ name: 'so_tien', type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    name: 'loai_giao_dich',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  transactionType: string;

  @Column({ name: 'ghi_chu', type: 'varchar', length: 255, nullable: true })
  note: string;
  @Column({
    name: 'trang_thai',
    enum: PAYMENT_STATUS,
    default: PAYMENT_STATUS.PENDING,
    nullable: false,
    type: 'enum',
    enumName: 'transaction_status_enum',
  })
  status: PAYMENT_STATUS;

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
