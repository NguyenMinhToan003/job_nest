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

@Entity({ name: 'doanh_nghiep' })
export class Company {
  @PrimaryColumn({ name: 'tai_khoan_id' })
  id: number;
  @Column({ name: 'ten_doanh_nghiep', length: 255, nullable: true })
  name: string;
  @Column({ name: 'gioi_thieu', length: 255, nullable: true })
  introduction: string;
  @Column({ name: 'logo', type: 'text', nullable: true })
  logo: string;
  @Column({ name: 'ma_so_thue', length: 255, nullable: true })
  taxCode: string;

  @OneToOne(() => Account, (account) => account.company)
  @JoinColumn({ name: 'tai_khoan_id', referencedColumnName: 'id' })
  account: Account;

  @ManyToOne(() => Country, (country) => country.companies)
  @JoinColumn({ name: 'ma_quoc_gia', referencedColumnName: 'code' })
  country: Country;

  @OneToMany(() => Post, (post) => post.company)
  posts: Post[];

  @OneToMany(() => Location, (location) => location.company)
  locations: Location[];

  @OneToMany(() => Follow, (follow) => follow.company)
  follows: Follow[];

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}
