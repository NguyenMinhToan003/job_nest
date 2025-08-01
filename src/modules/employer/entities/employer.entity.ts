import { Account } from 'src/modules/account/entities/account.entity';
import { BusinessType } from 'src/modules/business-type/entities/business-type.entity';
import { Country } from 'src/modules/country/entities/country.entity';
import { EmployerScale } from 'src/modules/employer-scales/entities/employer-scale.entity';
import { EmployerSubscription } from 'src/modules/employer_subscriptions/entities/employer_subscription.entity';
import { Follow } from 'src/modules/follow/entities/follow.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { TagResume } from 'src/modules/tag-resume/entities/tag-resume.entity';
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
  @Column({ name: 'ma_so_thue', length: 13, nullable: false, unique: true })
  taxCode: string;

  @Column({ name: 'website', nullable: true })
  website: string;

  @Column({ name: 'so_dien_thoai', length: 11, unique: true })
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

  @OneToMany(() => Location, (location) => location.employer)
  locations: Location[];

  @OneToMany(() => Follow, (follow) => follow.employer)
  follows: Follow[];

  @OneToMany(() => Job, (job) => job.employer)
  jobs: Job[];

  @OneToMany(
    () => EmployerSubscription,
    (subscription) => subscription.employer,
  )
  employerSubscriptions: EmployerSubscription[];

  @OneToMany(() => TagResume, (tagResume) => tagResume.employer)
  tagResumes: TagResume[];
}
