import { Job } from 'src/modules/job/entities/job.entity';
import { Major } from 'src/modules/major/entities/major.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'linh_vuc' })
export class Field {
  @PrimaryGeneratedColumn({ name: 'ma_linh_vuc' })
  id: number;
  @Column({ name: 'ten_linh_vuc' })
  name: string;
  @DeleteDateColumn({ name: 'ngay_an' })
  hidenAt: Date;

  @OneToMany(() => Major, (major) => major.field)
  majors: Major[];

  @OneToMany(() => Job, (job) => job.field)
  jobs: Job[];
}
