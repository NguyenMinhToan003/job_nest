import { EmployerSubscription } from 'src/modules/employer_subscriptions/entities/employer_subscription.entity';
import { PackageType } from 'src/types/enum';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'goi_dich_vu' })
export class Package {
  @PrimaryColumn({ name: 'id' })
  id: string;
  @Column({ name: 'ten_goi', type: 'varchar', length: 255, nullable: false })
  name: string;
  @Column({ name: 'tinh_nang', type: 'text', nullable: false })
  features: string;
  @Column({
    name: 'gia',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({ name: 'trang_thai', type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'hinh_anh', type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({
    name: 'so_ngay_hieu_luc',
    type: 'int',
    nullable: false,
    default: 7,
  })
  dayValue: number;

  @Column({
    name: 'kieu_goi',
    type: 'enum',
    enum: PackageType,
    nullable: false,
  })
  type: PackageType;

  @OneToMany(
    () => EmployerSubscription,
    (employerSubscription) => employerSubscription.package,
  )
  employerSubscriptions: EmployerSubscription[];
}
