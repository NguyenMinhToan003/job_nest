import { Account } from 'src/account/entities/account.entity';
import { Country } from 'src/country/entities/country.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { Job } from 'src/job/entities/job.entity';
import { Location } from 'src/location/entities/location.entity';
import { Post } from 'src/post/entities/post.entity';
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
  @Column({ name: 'gioi_thieu', length: 255, nullable: true })
  introduction: string;
  @Column({ name: 'logo', type: 'text', nullable: true })
  logo: string;
  @Column({ name: 'ma_so_thue', length: 255, nullable: true })
  taxCode: string;

  @OneToOne(() => Account, (account) => account.employer)
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  account: Account;

  @ManyToOne(() => Country, (country) => country.companies)
  @JoinColumn({ name: 'ma_quoc_gia', referencedColumnName: 'code' })
  country: Country;

  @OneToMany(() => Post, (post) => post.employer)
  posts: Post[];

  @OneToMany(() => Location, (location) => location.employer)
  locations: Location[];

  @OneToMany(() => Follow, (follow) => follow.employer)
  follows: Follow[];

  @OneToMany(() => Job, (job) => job.employer)
  jobs: Job[];
}
