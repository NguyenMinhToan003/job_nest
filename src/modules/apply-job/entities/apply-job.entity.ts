import { Cv } from 'src/modules/cv/entities/cv.entity';
import { Interview } from 'src/modules/interview/entities/interview.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { APPLY_JOB_STATUS } from 'src/types/enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  JoinColumn,
  OneToMany,
  // OneToMany,
} from 'typeorm';

@Entity({ name: 'ung_tuyen' })
@Unique(['cvId', 'jobId'])
export class ApplyJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ma_cv' })
  cvId: number;

  @Column({ name: 'ma_cong_viec' })
  jobId: number;

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

  // Quan hệ ManyToOne đến Job
  @ManyToOne(() => Job, (job) => job.applyJobs, { nullable: false })
  @JoinColumn({ name: 'ma_cong_viec' })
  job: Job;

  // Quan hệ ManyToOne đến CV
  @ManyToOne(() => Cv, (cv) => cv.applyJobs, { nullable: false })
  @JoinColumn({ name: 'ma_cv' })
  cv: Cv;

  // Quan hệ OneToMany với các cuộc phỏng vấn
  @OneToMany(() => Interview, (interview) => interview.applyJob)
  interviews: Interview[];

  // // Quan hệ OneToMany với các ghi chú (note) mở rộng
  // @OneToMany(() => ApplyJobNote, (note) => note.applyJob)
  // notes: ApplyJobNote[];
}
