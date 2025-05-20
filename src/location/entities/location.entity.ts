import { Company } from 'src/company/entities/company.entity';
import { District } from 'src/district/entities/district.entity';
import { Job } from 'src/job/entities/job.entity';
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
  @Column({ name: 'plandId', length: 255 })
  plandId: string;
  @ManyToOne(() => District, (district) => district.locations, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_quan_huyen', referencedColumnName: 'id' })
  district: District;

  @ManyToOne(() => Company, (company) => company.locations, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_doanh_nghiep', referencedColumnName: 'id' })
  company: Company;
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
