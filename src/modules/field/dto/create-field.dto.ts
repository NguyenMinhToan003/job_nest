import { IsNotEmpty } from 'class-validator';

export class CreateFieldDto {
  @IsNotEmpty()
  name: string;
}
