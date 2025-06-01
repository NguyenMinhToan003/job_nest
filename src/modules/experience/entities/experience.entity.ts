import { Resume } from 'src/modules/resume/entities/resume.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'kinh_nghiem' })
export class Experience {
  @PrimaryGeneratedColumn({ name: 'ma_kinh_nghiem' })
  id: number;

  @Column({ name: 'ten_kinh_nghiem' })
  name: string;

  @Column({ name: 'mo_ta_kinh_nghiem' })
  description: string;

  @Column({ name: 'trang_thai_kinh_nghiem', default: 1 })
  status: number;

  @OneToMany(() => Job, (job) => job.experience)
  jobs: Job[];

  @OneToMany(() => Resume, (resume) => resume.experience)
  resumes: Resume[];
}
