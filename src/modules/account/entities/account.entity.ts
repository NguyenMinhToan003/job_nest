import { ACCOUNT_STATUS, ROLE_LIST } from 'src/types/enum';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { NotiAccount } from 'src/modules/noti-account/entities/noti-account.entity';

@Entity({ name: 'tai_khoan' })
export class Account {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'ma_google', nullable: true })
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
  @Column({
    name: 'trang_thai',
    type: 'enum',
    enum: ACCOUNT_STATUS,
    enumName: 'trang_thai',
    default: ACCOUNT_STATUS.CREATED,
  })
  status: ACCOUNT_STATUS;
  @Column({
    name: 'ngay_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => Candidate, (candidate) => candidate.account)
  candidate: Candidate;

  @OneToOne(() => Employer, (employer) => employer.account)
  employer: Employer;

  @OneToMany(() => NotiAccount, (notiAccount) => notiAccount.receiverAccount)
  receiverAccount: NotiAccount[];
}
