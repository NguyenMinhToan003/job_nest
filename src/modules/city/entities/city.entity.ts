import { District } from 'src/modules/district/entities/district.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'thanh_pho' })
export class City {
  @PrimaryColumn({ name: 'ma_thanh_pho' })
  id: string;
  @Column({
    name: 'ten_thanh_pho',
    length: 255,
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(() => District, (district) => district.city)
  districts: District[];
}
