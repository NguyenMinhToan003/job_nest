import { Job } from 'src/modules/job/entities/job.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'trong_so_danh_gia' })
export class MatchingWeight {
  @PrimaryColumn({ name: 'ma_cong_viec' })
  jobId: number;

  @Column({ name: 'diem_dia_diem_lam_viec', type: 'int', default: 0 })
  locationWeight: number;

  @Column({ name: 'diem_ky_nang', type: 'int', default: 0 })
  skillWeight: number;

  @Column({ name: 'diem_nganh_nghe', type: 'int', default: 0 })
  majorWeight: number;

  @Column({ name: 'diem_ngoai_ngu', type: 'int', default: 0 })
  languageWeight: number;

  @Column({ name: 'diem_trinh_do_hoc_van', type: 'int', default: 0 })
  educationWeight: number;

  @Column({ name: 'diem_cap_bac', type: 'int', default: 0 })
  levelWeight: number;

  @OneToOne(() => Job, (job) => job.matchingWeights, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_cong_viec' })
  job: Job;
}
