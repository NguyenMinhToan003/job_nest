import { Job } from 'src/modules/job/entities/job.entity';
import { Package } from 'src/packages/entities/package.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
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

  @Column({ name: 'ngay_bat_dau', type: 'date', nullable: false })
  startDate: Date;
  @Column({ name: 'ngay_ket_thuc', type: 'date', nullable: false })
  endDate: Date;
  @Column({ name: 'trang_thai', type: 'varchar', length: 50, nullable: false })
  status: string;
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

  @ManyToOne(() => Job, (job) => job.employerSubscription, {
    nullable: true,
  })
  @JoinColumn({ name: 'cong_viec_id', referencedColumnName: 'id' })
  job: Job;
}
