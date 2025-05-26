import { Job } from 'src/modules/job/entities/job.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'khinh_nghiem' })
export class Experience {
  @PrimaryGeneratedColumn({ name: 'ma_khinh_nghiem' })
  id: number;

  @Column({ name: 'ten_khinh_nghiem' })
  name: string;

  @Column({ name: 'mo_ta_khinh_nghiem' })
  description: string;

  @Column({ name: 'trang_thai_khinh_nghiem', default: 1 })
  status: number;

  @OneToMany(() => Job, (job) => job.experience)
  jobs: Job[];
}
