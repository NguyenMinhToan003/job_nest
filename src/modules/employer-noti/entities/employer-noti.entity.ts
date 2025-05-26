import { Employer } from 'src/modules/employer/entities/employer.entity';
import { NOTI_TYPE } from 'src/types/enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'nha_tuyen_dung_thong_bao' })
export class EmployerNoti {
  @PrimaryGeneratedColumn({ name: 'ma_thong_bao' })
  id: number;

  @Column({ name: 'tieu_de', type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ name: 'noi_dung', type: 'text', nullable: true })
  content: string;
  @Column({ name: 'da_doc', type: 'tinyint', default: 0 })
  isRead: number;

  @Column({
    name: 'thoi_gian',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;

  @Column({ name: 'duong_dan', type: 'text', nullable: true })
  link: string;

  @Column({
    name: 'loai_thong_bao',
    type: 'varchar',
    length: 50,
    default: NOTI_TYPE.DEFAULT,
  })
  type: string;

  @ManyToOne(() => Employer, (employer) => employer.employerNotis, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  employer: Employer;
}
