import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cv' })
export class Cv {
  @PrimaryGeneratedColumn({ name: 'ma_cv' })
  id: number;

  @Column({ name: 'public_id' })
  publicId: string;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'ten_file' })
  name: string;

  @Column({ name: 'dinh_dang' })
  typeFile: string;

  @Column({
    name: 'tg_cap_nhat',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
