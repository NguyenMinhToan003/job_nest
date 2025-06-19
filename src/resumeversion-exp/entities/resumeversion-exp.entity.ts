import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'kinh_nghiem_lam_viec' })
export class ResumeversionExp {
  @PrimaryGeneratedColumn({ name: 'ma' })
  id: number;
  @Column({ name: 'ten_cong_ty', type: 'varchar', length: 255 })
  companyName: string;
  @Column({ name: 'vi_tri', type: 'varchar', length: 255 })
  position: string;
  @Column({ name: 'thoi_gian_bat_dau', type: 'date' })
  startTime: Date;
  @Column({ name: 'thoi_gian_ket_thuc', type: 'date', nullable: true })
  endTime: Date | null;
  @Column({ name: 'mo_ta_cong_viec', type: 'text', nullable: false })
  jobDescription: string;

  @ManyToOne(
    () => ResumeVersion,
    (resumeVersion) => resumeVersion.experiences,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'ma_ho_so' })
  resumeVersion: ResumeVersion;
}
