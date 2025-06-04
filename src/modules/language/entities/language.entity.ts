import { LanguageJob } from 'src/language-job/entities/language-job.entity';
import { LanguageResume } from 'src/modules/language-resume/entities/language-resume.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ngon_ngu' })
export class Language {
  @PrimaryGeneratedColumn({ name: 'ma_ngon_ngu' })
  id: number;

  @Column({ name: 'ten_ngon_ngu' })
  name: string;

  @OneToMany(() => LanguageResume, (languageResume) => languageResume.language)
  languageResumes: LanguageResume[];

  @OneToMany(() => LanguageJob, (languageJob) => languageJob.language)
  languageJobs: LanguageJob[];
}
