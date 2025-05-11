import { Job } from 'src/job/entities/job.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'hinh_thuc_lam_viec' })
export class TypeJob {
  @PrimaryGeneratedColumn({ name: 'ma_hinh_thuc_lam_viec' })
  id: number;
  @Column({ name: 'ten_hinh_thuc_lam_viec', length: 255 })
  name: string;

  @OneToMany(() => Job, (job) => job.typeJob)
  jobs: Job[];
}
