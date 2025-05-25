import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'theo_doi' })
export class Follow {
  @PrimaryColumn({ name: 'ma_tai_khoan' })
  userId: number;

  @PrimaryColumn({ name: 'ma_doanh_nghiep' })
  companyId: number;

  @Column({
    name: 'thoi_gian',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;

  @ManyToOne(() => Candidate, (candidate) => candidate.follows)
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  candidate: Candidate;

  @ManyToOne(() => Employer, (employer) => employer.follows)
  @JoinColumn({ name: 'ma_nha_tuyen_dung', referencedColumnName: 'id' })
  employer: Employer;
}
