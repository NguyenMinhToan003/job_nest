import { District } from 'src/district/entities/district.entity';
import { NotiSetting } from 'src/noti-setting/entities/noti-setting.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'thanh_pho' })
export class City {
  @PrimaryColumn({ name: 'ma_thanh_pho' })
  id: string;
  @Column({ name: 'ten_thanh_pho', length: 255 })
  name: string;

  @OneToMany(() => District, (district) => district.city)
  districts: District[];

  @OneToMany(() => NotiSetting, (notiSetting) => notiSetting.city)
  notiSettings: NotiSetting[];
}
