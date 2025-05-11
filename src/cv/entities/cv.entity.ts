import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cv' })
export class Cv {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'public_id' })
  publicId: string;

  @Column({ name: 'url' })
  url: string;

  @ManyToOne(() => User, (user) => user.cv, { nullable: false })
  @JoinColumn({ name: 'ma_nguoi_dung' })
  user: User;
}
