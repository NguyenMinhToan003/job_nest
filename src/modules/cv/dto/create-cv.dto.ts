import { IsNotEmpty } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty()
  userId: number;
}
