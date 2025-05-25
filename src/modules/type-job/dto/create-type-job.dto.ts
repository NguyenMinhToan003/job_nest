import { IsNotEmpty } from 'class-validator';

export class CreateTypeJobDto {
  @IsNotEmpty()
  name: string;
}
