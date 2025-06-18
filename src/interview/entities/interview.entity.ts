import { ApplyJob } from 'src/modules/apply-job/entities/apply-job.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'phong_van' })
export class Interview {
  @PrimaryGeneratedColumn({ name: 'ma_phong_van' })
  id: number;

  @Column({
    name: 'thoi_gian',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;

  @Column({ name: 'dia_diem', length: 255 })
  location: string;

  @Column({ name: 'trang_thai', type: 'int', default: 0 })
  status: number;

  @Column({ name: 'ghi_chu', type: 'text', nullable: true })
  note: string | null;
}
