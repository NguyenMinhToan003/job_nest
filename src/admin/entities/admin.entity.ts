import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryColumn({ name: 'tai_khoan_id' })
  id: number;
}
