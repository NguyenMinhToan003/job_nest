import { IsNotEmpty } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty({ message: 'thieu id nguoi dung' })
  userId: number;
}
