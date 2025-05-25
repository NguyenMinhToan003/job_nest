import { Employer } from 'src/modules/employer/entities/employer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'bai_viet' })
export class Post {
  @PrimaryGeneratedColumn({ name: 'ma_bai_viet' })
  id: number;
  @Column({ name: 'tieu_de', length: 255 })
  title: string;
  @Column({ name: 'noi_dung', length: 255 })
  content: string;

  @ManyToOne(() => Employer, (employer) => employer.posts)
  @JoinColumn({ name: 'ma_doanh_nghiep', referencedColumnName: 'id' })
  employer: Employer;
}
