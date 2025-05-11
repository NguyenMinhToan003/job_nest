import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tai_khoan' })
export class Account {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;
  @Column({ name: 'hinh_anh', length: 255, nullable: true })
  avatar: string;

  @Column({ name: 'google_id', length: 255, nullable: true })
  googleId: string;

  @Column({ name: 'email', length: 255, unique: true })
  email: string;
  @Column({ name: 'mat_khau', length: 255, nullable: true })
  password: string;
  @Column({
    name: 'vai_tro',
    type: 'enum',
    enum: ['USER', 'ADMIN', 'DOANH_NGHIEP'],
    default: 'USER',
  })
  role: string;
  @Column({ name: 'trang_thai', default: 1 })
  status: number;
  @Column({
    name: 'ngay_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.account)
  user: User;

  @OneToOne(() => Company, (company) => company.account)
  company: Company;
}
