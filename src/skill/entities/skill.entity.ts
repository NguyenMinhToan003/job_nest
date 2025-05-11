import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ky_nang' })
export class Skill {
  @PrimaryGeneratedColumn({ name: 'ma_ky_nang' })
  id: number;
  @Column({ name: 'ten_ky_nang', length: 255 })
  name: string;
  @Column({ name: 'mo_ta', length: 255 })
  description: string;

  @ManyToMany(() => User, (user) => user.skills)
  @JoinTable({
    name: 'nguoi_dung_ky_nang',
    joinColumn: { name: 'ma_ky_nang', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'tai_khoan_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];
}
