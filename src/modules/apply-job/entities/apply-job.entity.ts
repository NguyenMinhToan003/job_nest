import { Interview } from 'src/interview/entities/interview.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import { APPLY_JOB_STATUS } from 'src/types/enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
@Entity({ name: 'ung_tuyen' })
export class ApplyJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'thoi_gian_ung_tuyen',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  applyTime: Date;

  @Column({
    type: 'enum',
    enum: APPLY_JOB_STATUS,
    enumName: 'trang_thai_ung_tuyen',
    default: APPLY_JOB_STATUS.PENDING,
  })
  status: APPLY_JOB_STATUS;

  @Column({ nullable: true, type: 'text' })
  note: string;

  @Column({ name: 'da_xem', default: 0 })
  viewStatus: number;

  @ManyToOne(() => Job, (job) => job.applyJobs, { nullable: false })
  @JoinColumn({ name: 'ma_cong_viec' })
  job: Job;

  @ManyToOne(() => ResumeVersion, (resumeVersion) => resumeVersion.applyJobs, {
    nullable: false,
  })
  @JoinColumn({ name: 'phien_ban_ho_so' })
  resumeVersion: ResumeVersion;
}
