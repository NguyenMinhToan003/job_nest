import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { Package } from 'src/modules/packages/entities/package.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { EMPLOYER_SUBSCRIPTION_STATUS } from 'src/types/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'nha_tuyen_dung_dang_ky' })
export class EmployerSubscription {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  note: string;

  @Column({ name: 'ngay_bat_dau', type: 'date', nullable: true })
  startDate: Date;

  @Column({ name: 'ngay_ket_thuc', type: 'date', nullable: true })
  endDate: Date;

  @Column({
    name: 'trang_thai',
    type: 'enum',
    enum: EMPLOYER_SUBSCRIPTION_STATUS,
    default: EMPLOYER_SUBSCRIPTION_STATUS.ACTIVE,
    nullable: false,
  })
  status: EMPLOYER_SUBSCRIPTION_STATUS;

  @Column({
    name: 'ngay_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.employerSubscriptions,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'ma_giao_dich', referencedColumnName: 'id' })
  transaction: Transaction;

  @ManyToOne(
    () => Package,
    (packageEntity) => packageEntity.employerSubscriptions,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'goi_dich_vu_id', referencedColumnName: 'id' })
  package: Package;

  @ManyToOne(() => Employer, (employer) => employer.employerSubscriptions, {
    nullable: false,
  })
  @JoinColumn({ name: 'nha_tuyen_dung_id', referencedColumnName: 'id' })
  employer: Employer;

  @ManyToOne(() => Job, (job) => job.employerSubscription, {
    nullable: true,
  })
  @JoinColumn({ name: 'cong_viec_id', referencedColumnName: 'id' })
  job: Job;
}
