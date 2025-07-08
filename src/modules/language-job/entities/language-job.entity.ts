import { Job } from 'src/modules/job/entities/job.entity';
import { Language } from 'src/modules/language/entities/language.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ngon_ngu_cong_viec' })
export class LanguageJob {
  @PrimaryColumn({ name: 'ma_ngon_ngu' })
  languageId: string;

  @PrimaryColumn({ name: 'ma_cong_viec' })
  jobId: number;

  @ManyToOne(() => Language, (language) => language.languageJobs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_ngon_ngu' })
  language: Language;

  @ManyToOne(() => Job, (job) => job.languageJobs, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_cong_viec' })
  job: Job;
}
