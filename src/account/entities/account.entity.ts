import { ROLE_LIST } from 'src/types/enum';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employer } from 'src/employer/entities/employer.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';

@Entity({ name: 'tai_khoan' })
export class Account {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'google_id', length: 255, nullable: true })
  googleId: string;

  @Column({ name: 'email', length: 255, unique: true })
  email: string;
  @Column({ name: 'mat_khau', length: 255, nullable: true })
  password: string;
  @Column({
    name: 'vai_tro',
    type: 'enum',
    enum: ROLE_LIST,
    default: ROLE_LIST.CANDIDATE,
    enumName: 'vai_tro',
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

  @OneToOne(() => Candidate, (user) => user.account)
  user: Candidate;

  @OneToOne(() => Employer, (employer) => employer.account)
  employer: Employer;
}
