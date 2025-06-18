import { Field } from 'src/modules/field/entities/field.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'chuyen_nganh' })
export class Major {
  @PrimaryGeneratedColumn({ name: 'ma_chuyen_nganh' })
  id: number;
  @Column({ name: 'ten_chuyen_nganh', length: 255 })
  name: string;

  @DeleteDateColumn({ name: 'ngay_an' })
  hidenAt: Date;

  @ManyToOne(() => Field, (field) => field.majors)
  @JoinColumn({ name: 'ma_linh_vuc' })
  field: Field;

  @OneToMany(() => Skill, (skill) => skill.major)
  skills: Skill[];

  @ManyToMany(() => ResumeVersion, (resumeVersion) => resumeVersion.majors)
  resumeVersions: ResumeVersion[];
}
