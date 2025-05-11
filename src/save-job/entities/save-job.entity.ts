import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cong_viec_luu_tru' })
export class SaveJob {
  @PrimaryColumn({ name: 'ma_cong_viec' })
  jobId: string;
  @PrimaryColumn({ name: 'tai_khoan_id' })
  id: number;
  @Column({ name: 'ngay_luu' })
  savedDate: Date;

  @ManyToOne(() => Job, (job) => job.saveJobs)
  @JoinColumn({ name: 'ma_cong_viec', referencedColumnName: 'id' })
  job: Job;
  @ManyToOne(() => User, (user) => user.saveJobs)
  @JoinColumn({ name: 'tai_khoan_id', referencedColumnName: 'id' })
  user: User;
}
