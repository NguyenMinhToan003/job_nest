import { ROLE_LIST } from 'src/types/enum';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { AuthToken } from 'src/modules/auth_token/entities/auth_token.entity';
import { NotiAccount } from 'src/modules/noti-account/entities/noti-account.entity';
import { Roomchat } from 'src/modules/roomchat/entities/roomchat.entity';
import { Message } from 'src/modules/messages/entities/message.entity';

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
  @Column({ name: 'trang_thai', default: 1 })
  status: number;
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

  @OneToMany(() => AuthToken, (authToken) => authToken.account)
  authTokens: AuthToken[];

  @OneToMany(() => NotiAccount, (notiAccount) => notiAccount.receiverAccount)
  receiverAccount: NotiAccount[];

  @OneToMany(() => NotiAccount, (notiAccount) => notiAccount.senderAccount)
  senderAccount: NotiAccount[];

  @ManyToMany(() => Roomchat, (room) => room.accounts)
  @JoinTable({
    name: 'phong_nhan_tin_tai_khoan',
    joinColumn: { name: 'ma_tai_khoan', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'ma_phong_nhan_tin',
      referencedColumnName: 'id',
    },
  })
  rooms: Roomchat[];

  @OneToMany(() => Message, (message) => message.sender, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
