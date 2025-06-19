import { BusinessType } from 'src/business-type/entities/business-type.entity';
import { EmployerScale } from 'src/employer-scales/entities/employer-scale.entity';
import { Account } from 'src/modules/account/entities/account.entity';
import { Country } from 'src/modules/country/entities/country.entity';
import { Follow } from 'src/modules/follow/entities/follow.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Post } from 'src/modules/post/entities/post.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'nha_tuyen_dung' })
export class Employer {
  @PrimaryColumn({ name: 'ma_tai_khoan' })
  id: number;
  @Column({ name: 'ten_doanh_nghiep', length: 255, nullable: true })
  name: string;
  @Column({ name: 'gioi_thieu', type: 'text', nullable: true })
  introduction: string;
  @Column({ name: 'logo', type: 'text', nullable: true })
  logo: string;
  @Column({ name: 'ma_so_thue', length: 255, nullable: true })
  taxCode: string;

  @Column({ name: 'website', nullable: true })
  website: string;

  @Column({ name: 'so_dien_thoai', length: 11, nullable: true })
  phone: string;

  @OneToOne(() => Account, (account) => account.employer)
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  account: Account;

  @ManyToOne(() => Country, (country) => country.employees)
  @JoinColumn({ name: 'ma_quoc_gia', referencedColumnName: 'id' })
  country: Country;

  @ManyToOne(() => BusinessType, (businessType) => businessType.employers, {
    nullable: true,
  })
  @JoinColumn({ name: 'ma_loai_hinh_kinh_doanh', referencedColumnName: 'id' })
  businessType: BusinessType;

  @ManyToOne(() => EmployerScale, (employerScale) => employerScale.employers, {
    nullable: true,
  })
  @JoinColumn({ name: 'ma_quy_mo_nhan_su', referencedColumnName: 'id' })
  employeeScale: EmployerScale;

  @OneToMany(() => Post, (post) => post.employer)
  posts: Post[];

  @OneToMany(() => Location, (location) => location.employer)
  locations: Location[];

  @OneToMany(() => Follow, (follow) => follow.employer)
  follows: Follow[];

  @OneToMany(() => Job, (job) => job.employer)
  jobs: Job[];

  @OneToMany(() => Transaction, (transaction) => transaction.employer)
  transactions: Transaction[];
}
