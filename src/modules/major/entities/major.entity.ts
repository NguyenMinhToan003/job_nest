import { Field } from 'src/modules/field/entities/field.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'chuyen_mon' })
export class Major {
  @PrimaryGeneratedColumn({ name: 'ma_chuyen_mon' })
  id: number;
  @Column({ name: 'ten_chuyen_mon', length: 255 })
  name: string;

  @DeleteDateColumn({ name: 'ngay_an' })
  hidenAt: Date;

  @ManyToOne(() => Field, (field) => field.majors)
  @JoinColumn({ name: 'ma_linh_vuc' })
  field: Field;

  @OneToMany(() => Skill, (skill) => skill.major)
  skills: Skill[];
}
