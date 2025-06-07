import { Language } from 'src/modules/language/entities/language.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ngon_ngu_ho_so' })
export class LanguageResume {
  @PrimaryColumn({ name: 'ma_ngon_ngu' })
  languageId: number;
  @PrimaryColumn({ name: 'ma_phien_ban' })
  resumeVersionId: number;
  @PrimaryColumn({
    name: 'trinh_do',
    type: 'enum',
    enum: [1, 2, 3],
  })
  level: number;

  @ManyToOne(() => Language, (language) => language.languageResumes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_ngon_ngu' })
  language: Language;

  @ManyToOne(
    () => ResumeVersion,
    (resumeVersion) => resumeVersion.languageResumes,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'ma_phien_ban' })
  resumeVersion: ResumeVersion;
}
