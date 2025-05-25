import { District } from 'src/modules/district/entities/district.entity';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'dia_diem' })
export class Location {
  @PrimaryGeneratedColumn({ name: 'ma_dia_diem' })
  id: number;
  @Column({ name: 'ten_dia_diem', length: 255 })
  name: string;

  @Column({
    name: 'toa_do_x',
    nullable: false,
    type: 'decimal',
    precision: 10,
    scale: 8,
  })
  lat: number;
  @Column({
    name: 'toa_do_y',
    nullable: false,
    type: 'decimal',
    precision: 11,
    scale: 8,
  })
  lng: number;

  // giai thich precision va scale
  // precision: Tong so chu so
  // scale: So chu so sau dau phay
  // vi du: 10,12345678

  @Column({ name: 'kich_hoat', type: 'tinyint', default: 0 })
  enabled: number;

  @Column({ name: 'placeId', length: 255 })
  placeId: string;
  @ManyToOne(() => District, (district) => district.locations, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_quan_huyen', referencedColumnName: 'id' })
  district: District;

  @ManyToOne(() => Employer, (employer) => employer.locations, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_doanh_nghiep', referencedColumnName: 'id' })
  employer: Employer;

  @ManyToMany(() => Job, (job) => job.locations)
  @JoinTable({
    name: 'dia_diem_cong_viec',
    joinColumn: {
      name: 'ma_dia_diem',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
  })
  jobs: Job[];
}
