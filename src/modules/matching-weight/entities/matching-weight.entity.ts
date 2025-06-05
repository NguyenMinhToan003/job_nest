import { Job } from 'src/modules/job/entities/job.entity';
import { MatchingKey } from 'src/modules/matching-key/entities/matching-key.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'trong_so_danh_gia' })
export class MatchingWeight {
  @PrimaryColumn({ name: 'ma_tieu_chi' })
  matchingId: number;
  @PrimaryColumn({ name: 'ma_cong_viec' })
  jobId: number;

  @Column({ name: 'trong_so', type: 'float' })
  weight: number;

  @ManyToOne(() => MatchingKey, (matchingKey) => matchingKey.matchingWeights, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_tieu_chi' })
  matchingKey: MatchingKey;

  @ManyToOne(() => Job, (job) => job.matchingWeights, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_cong_viec' })
  job: Job;
}
