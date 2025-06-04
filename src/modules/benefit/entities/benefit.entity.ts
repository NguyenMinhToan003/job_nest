import { Job } from 'src/modules/job/entities/job.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'phuc_loi' })
export class Benefit {
  @PrimaryColumn({ name: 'ma_phuc_loi' })
  id: string;
  @Column({ name: 'ten_phuc_loi', length: 255 })
  name: string;
  @Column({ name: 'mo_ta', length: 255 })
  description: string;
  @Column({ name: 'icon', length: 255 })
  icon: string;
  @ManyToMany(() => Job, (job) => job.benefits)
  jobs: Job[];
}
