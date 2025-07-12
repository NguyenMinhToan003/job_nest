import { Major } from 'src/modules/major/entities/major.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'linh_vuc' })
export class Field {
  @PrimaryGeneratedColumn({ name: 'ma_linh_vuc' })
  id: number;
  @Column({ name: 'ten_linh_vuc' })
  name: string;

  @OneToMany(() => Major, (major) => major.field)
  majors: Major[];
}
